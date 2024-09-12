import mongoose, { Schema, Document } from 'mongoose';

interface IBook extends Document {
    boofRefId: string;
    name: string;
    author: string;
    category: string;
    rentPerDay: number;
}

const BookSchema: Schema = new Schema({
    boofRefId: { type: String, required: true },
    name: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    rentPerDay: { type: Number, required: true },
});


export const Book = mongoose.model<IBook>('Book', BookSchema);
