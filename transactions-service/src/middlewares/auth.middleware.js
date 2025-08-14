import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { Constants } from '../utils/constants.util';

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(httpStatus.UNAUTHORIZED).json(
    { error: Constants.MESSAGES.ERROR.AUTH.INVALID_CREDENTIALS }
  );

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(httpStatus.UNAUTHORIZED).json(
      { error: Constants.MESSAGES.ERROR.AUTH.INVALID_CREDENTIALS }
    );
  }
}
