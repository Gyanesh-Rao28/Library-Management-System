import mongoose, { Document, Schema } from 'mongoose';


interface IUser extends Document {
    email: string;
    password: string;
    createdAt: Date;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    
}, {
    timestamps: true
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;