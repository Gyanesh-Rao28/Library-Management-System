import { Request, Response } from 'express';

import { Book } from "../models/book.model"

const getBook = async (req: Request, res: Response) => {
    try {

        const books = await Book.find()

        res.status(200).json({
            data: books
        })

    } catch (error) {
        console.error('Error in getBook:', error);
        res.status(500).json({ message: "An error occurred while fetching the book" });
    }
}

const getBookByRefId = async (req: Request, res: Response) => {
    try {
        const { bookRefId } = req.params;

        if(!bookRefId){
            return res.status(400).json({ message: "Query is required" });
        }

        const book = await Book.findOne({
            boofRefId: bookRefId
        })

        if(!book){
            return res.status(404).json({ message: "Book not found" });
        }

        return res.status(200).json(book);

    } catch (error) {
        console.error('Error in getBookByRefId:', error);
        res.status(500).json({ message: "An error occurred while fetching the BookByRefId" });
    }
}


const insertBook = async (req: Request, res: Response) => {
    try {

        const {
            boofRefId,
            name,
            author,
            category,
            rentPerDay
        } = req.body

        if (!boofRefId || !name || !author || !category || !rentPerDay) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const trimmedBoofRefId = boofRefId.trim();
        const refIdExist = await Book.findOne({ boofRefId: trimmedBoofRefId });

        if (refIdExist) {
            return res.status(409).json({ message: "Book with this reference id already exists" });
        }

        const book = await Book.create({
            boofRefId,
            name,
            author,
            category,
            rentPerDay
        })

        res.status(200).json({
            message: `Book registered successfully! RefId: ${book._id} `,
        });


    } catch (error) {
        console.error('Error in insertBook:', error);
        res.status(500).json({ message: "An error occurred while inserting the book" });
    }
}


const bookByterm = async (req: Request, res: Response) => {
    try {
        const { term } = req.query;
        if (!term) {
            return res.status(400).json({ message: "Search term is required" });
        }

        const books = await Book.find({
            name: { $regex: term as string, $options: 'i' }
        });

        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "An error occurred while searching books" });
    }
}

const bookRentRange = async (req: Request, res: Response) => {
    try {
        const { min, max } = req.query;
        if (!min || !max) {
            return res.status(400).json({ message: "Both min and max rent values are required" });
        }

        const books = await Book.find({
            rentPerDay: { $gte: Number(min), $lte: Number(max) }
        });

        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "An error occurred while searching books by rent range" });
    }
}

const bookFilter = async (req: Request, res: Response) => {
    try {
        const { category, term, minRent, maxRent } = req.query;
        if (!category || !term || !minRent || !maxRent) {
            return res.status(400).json({ message: "All search parameters are required" });
        }

        const books = await Book.find({
            category: category as string,
            name: { $regex: term as string, $options: 'i' },
            rentPerDay: { $gte: Number(minRent), $lte: Number(maxRent) }
        });

        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "An error occurred during advanced book search" });
    }
}


export { insertBook, getBookByRefId, getBook, bookByterm, bookRentRange, bookFilter }