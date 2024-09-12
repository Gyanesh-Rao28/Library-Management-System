import { Request, Response } from 'express';

import User from '../models/user.model'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, password} = req.body;

        if ( !email || !password ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(409).json({ message: "User with this email or username already exists" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

       
        const newUser = await User.create({
            email,
            password: hashedPassword,
        });

        const payload = {
            user: {
                id: newUser._id,
            }
        }

        const JWT_SECRET = process.env.JWT_SECRET

        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        const authToken = jwt.sign(payload, JWT_SECRET)

        res.status(200).json({
            message: "User registered successfully",
            authToken: authToken
        });

    } catch (error) {
        console.error('Error in user registration:', error);
        res.status(500).json({ message: 'Error registering user', error: (error as Error).message });
    }
};


const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const payload = {
            user: {
                id: user._id,
                email: user.email
            }
        };

        const token = jwt.sign(
            payload,
            JWT_SECRET,
        );

        res.status(200).json({
            message: "User logged in successfully",
            token: token,
        });

    } catch (error) {
        console.error('Error in user login:', error);
        res.status(500).json({ message: 'Error logging in', error: (error instanceof Error) ? error.message : String(error) });
    }
};

export { registerUser, loginUser };