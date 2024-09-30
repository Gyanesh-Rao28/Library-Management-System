import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
    userId: string;
    
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

const fetchuser = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.header('authToken');

    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;

        req.user = decoded;

        const data = req.user
        console.log(data)

        next();
    } catch (error) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

export default fetchuser;