import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { Constants } from '../utils/constants.util.js';

export function authMiddleware(req, res, next) {
    const token = req.cookies['auth-token'];
    if (!token) {
        return res
            .status(httpStatus.UNAUTHORIZED)
            .send(Constants.MESSAGES.ERROR.AUTH.INVALID_CREDENTIALS);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return res
            .status(httpStatus.UNAUTHORIZED)
            .send(Constants.MESSAGES.ERROR.AUTH.INVALID_CREDENTIALS);
    }
}
