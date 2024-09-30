import { Request, Response } from 'express';
import { Transaction } from '../models/bill.model';
import { Book } from '../models/book.model';
import User from '../models/user.model';
import mongoose from 'mongoose';

interface IUser extends mongoose.Document {
    email: string;
    // Add other user properties as needed
}

// Define types for the result
type IssuedBookResult = {
    totalIssueCount: number;
    currentlyIssuedTo: string;
    status: 'issued';
};

type NotIssuedBookResult = {
    totalIssueCount: number;
    status: 'not issued';
};

type BookIssueHistoryResult = IssuedBookResult | NotIssuedBookResult;

const issueBook = async (req: Request, res: Response) => {
    try {
        const { bookId, userId } = req.body;

        if (!bookId || !userId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        const existingTransaction = await Transaction.findOne({
            bookId: book._id,
            status: 'issued'
        });

        if (existingTransaction) {
            return res.status(400).json({ message: "This book is already issued" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
   
        const transaction = new Transaction({
            bookId: book._id,
            userId: user._id,
            issueDate: new Date(),
            status: 'issued'
        });

        await transaction.save();

        res.status(201).json({ message: `Book issued successfully ${transaction._id}`, transaction });

    } catch (error) {
        console.error('Error in issueBook:', error);
        res.status(500).json({
            message: "An error occurred while issuing the book",
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

const returnBook = async (req: Request, res: Response)=>{

    try {
        const { bookId, userId } = req.body
    
        if (!bookId || !userId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        
    
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const transaction = await Transaction.findOne({
            bookId: book._id,
            userId,
            status: 'issued'
        });

        if (!transaction) {
            return res.status(404).json({ message: "No open transaction found for this book and user" });
        }

        const issueDate = new Date(transaction.issueDate);
        const actualReturnDate = new Date();
        const daysRented = Math.ceil((actualReturnDate.getTime() - issueDate.getTime()) / (1000 * 3600 * 24));
        const rentAmount = daysRented * book.rentPerDay;

        transaction.returnDate = actualReturnDate;
        transaction.rentAmount = rentAmount;
        transaction.status = 'returned';


        await transaction.save();


        res.status(201).json({ message: `Book returned successfully`, transaction });

    } catch (error) {
        console.error('Error in returnBook:', error);
        res.status(500).json({
            message: "An error occurred while returning the book",
            error: error instanceof Error ? error.message : String(error)
        });
    }

}

const bookHistory = async (req: Request, res: Response )=>{
    try {
        const { bookName } = req.query;
        
        const book = await Book.findOne({ name: bookName });
        
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const transactions = await Transaction.find({ bookId: book._id }).populate<{ userId: IUser }>({
            path: 'userId',
            select: '-password'
        });

        const issuedCount = transactions.length;
        const currentlyIssued = transactions.find(t => t.status === 'issued');

        let result: BookIssueHistoryResult;

        if (currentlyIssued) {
            result = {
                totalIssueCount: issuedCount,
                currentlyIssuedTo: currentlyIssued.userId.email,
                status: 'issued'
            };
        } else {
            result = {
                totalIssueCount: issuedCount,
                status: 'not issued'
            };
        }

        res.status(200).json({result});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

const getTotalRentBook = async (req: Request, res: Response) =>{
    try {
        const { bookName } = req.query;

        if (!bookName) {
            return res.status(400).json({ message: 'Book name is required' });
        }

        const book = await Book.findOne({ name: bookName });

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const result = await Transaction.aggregate([
            { $match: { bookId: book._id } },
            { $group: { _id: null, totalRent: { $sum: '$rentAmount' } } }
        ]);

        const totalRent = result.length > 0 ? result[0].totalRent : 0;

        res.status(200).json({ bookName, totalRent });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}


const getBooksIssuedToPerson = async (req: Request, res: Response) =>{
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const transactions = await Transaction.find({ userId: user._id, status: 'issued' }).populate('bookId');

        const issuedBooks = transactions.map(t => ({
            bookName: (t.bookId as any).name,
            issueDate: t.issueDate
        }));

        res.json({ user: user.email, issuedBooks });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

const getBooksIssuedInDateRange = async (req: Request, res: Response) =>{
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required' });
        }

        const transactions = await Transaction.find({
            issueDate: { $gte: new Date(startDate as string), $lte: new Date(endDate as string) }
        }).populate('bookId userId');

        const issuedBooks = transactions.map(t => ({
            bookName: (t.bookId as any).name,
            issuedTo: (t.userId as any).email,
            issueDate: t.issueDate
        }));

        res.json({ issuedBooks });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}



export { issueBook, returnBook, bookHistory, getTotalRentBook, getBooksIssuedToPerson, getBooksIssuedInDateRange };