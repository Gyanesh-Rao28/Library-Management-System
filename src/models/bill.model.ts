import mongoose, { Schema, Document } from 'mongoose';

interface ITransaction extends Document {
    bookId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    issueDate: Date;
    returnDate: Date;
    rentAmount: number;
    status: 'issued' | 'returned';
}

const TransactionSchema: Schema = new Schema({
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    issueDate: { type: Date, required: true },
    returnDate: { type: Date },
    rentAmount: { type: Number },
    status: { type: String, enum: ['issued', 'returned'], default: 'issued' },
});

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);