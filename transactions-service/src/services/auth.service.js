import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UsersRepository from '../repositories/users.repository.js';
import httpStatus from 'http-status';
import createError from 'http-errors';
import { Constants } from '../utils/constants.util.js';

export default class AuthService {
    constructor() {
        this.usersRepository = new UsersRepository();
    }

    async register({ email, password, name }) {
        const exists = await this.usersRepository.findByEmail(email);
        if (exists)
            throw createError(
                httpStatus.CONFLICT,
                Constants.MESSAGES.ERROR.AUTH.EMAIL_EXISTS
            );

        const hash = await bcrypt.hash(password, 10);
        return await this.usersRepository.create({ email, password: hash, name });
    }

    async login(email, password) {
        const user = await this.usersRepository.findByEmail(email);
        if (!user)
            throw createError(
                httpStatus.UNAUTHORIZED,
                Constants.MESSAGES.ERROR.AUTH.INVALID_CREDENTIALS
            );


        const ok = await bcrypt.compare(password, user.password);
        if (!ok)
            throw createError(
                httpStatus.UNAUTHORIZED,
                Constants.MESSAGES.ERROR.AUTH.INVALID_CREDENTIALS
            );

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { token, user: { id: user.id, email: user.email } };
    }
}
