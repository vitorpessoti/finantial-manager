import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UsersRepository from '../repositories/users.repository.js';
import httpStatus from 'http-status';
import createError from 'http-errors';
import speakeasy from 'speakeasy';
import { Constants } from '../utils/constants.util.js';
import Logger from './logger.service.js';

const logger = new Logger({
    dateFormat: process.env.DATE_FORMAT,
    logsPath: process.env.LOGS_PATH
});

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
        try {
            const user = await this.checkAuthentication(email, password);

            if (!user.isTwoFactorEnabled) {
                // // Se o 2FA estiver ativado, não gera o token ainda.
                // // Retorna um sinal para o frontend pedir o código 2FA.
                // return {
                //     message: Constants.MESSAGES.SUCCESS.AUTH.TWO_FACTOR_REQUIRED,
                //     twoFactorRequired: true,
                //     userId: user.userId
                // };
                return await this.enable2FA(user.userId);
            }

            // if (user.userId) {
            //     const token = jwt.sign(
            //         user,
            //         process.env.JWT_SECRET,
            //         { expiresIn: '1h' }
            //     );

            //     return { message: Constants.MESSAGES.SUCCESS.AUTH.LOGGED_IN, userId: user.userId, token };
            // }
        } catch (error) {
            throw createError(
                httpStatus.UNAUTHORIZED,
                Constants.MESSAGES.ERROR.AUTH.INVALID_CREDENTIALS
            );
        }
    }

    async loginWith2FA(userId, twoFactorToken) {
        try {
            // const user = await this.checkAuthentication(email, password);
            // if (!user) {
            //     return res
            //         .status(httpStatus.UNAUTHORIZED)
            //         .json({ message: Constants.MESSAGES.ERROR.AUTH.TWO_FACTOR_REQUIRED });
            // }

            // if (!user.isTwoFactorEnabled) {
            //     return await this.enable2FA(user);
            // }
            const user = await this.usersRepository.findById(userId);
            if (!user || !user.isTwoFactorEnabled) {
                return res
                    .status(httpStatus.UNAUTHORIZED)
                    .json({ message: Constants.MESSAGES.ERROR.AUTH.TWO_FACTOR_REQUIRED });
            }

            // 2. Verifica se o código 2FA (token) é válido
            const tokenIsValid = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token: twoFactorToken,
                window: 2
            });

            if (tokenIsValid) {
                const token = jwt.sign(
                    { id: user.id }, // ou o objeto user que você usava
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
                return { message: Constants.MESSAGES.SUCCESS.AUTH.LOGGED_IN, userId: user.id, token };
            } else {
                return { message: Constants.MESSAGES.ERROR.AUTH.AUTHENTICATION_FAILED };
            }
        } catch (error) {
            console.error('Error logging in with 2FA:');
            console.error(error);
            throw createError(
                httpStatus.UNAUTHORIZED,
                Constants.MESSAGES.ERROR.AUTH.AUTHENTICATION_FAILED
            );
        }
    }

    async logout(res) {
        res.clearCookie('auth-token');
        return { message: Constants.MESSAGES.SUCCESS.AUTH.LOGGED_OUT };
    }

    async enable2FA(userId) {
        try {
            const secret = speakeasy.generateSecret({ length: 20, name: 'FinantialDashboard' });
            await this.usersRepository.update(userId, { twoFactorSecret: secret.base32 });

            return {
                qrCodeUrl: secret.otpauth_url,
                userId
            };
        } catch (error) {
            console.error('Error enabling 2FA token:');
            console.error(error);
            throw createError(
                httpStatus.INTERNAL_SERVER_ERROR,
                Constants.MESSAGES.ERROR.AUTH.AUTHENTICATION_FAILED
            );
        }
    }

    async enableUser2FA(userId) {
        try {
            await this.usersRepository.update(userId, { isTwoFactorEnabled: true });
            return { message: 'Two-factor authentication enabled successfully.' };
        } catch (error) {
            console.error('Error enabling user 2FA:');
            console.error(error);
            throw createError(
                httpStatus.INTERNAL_SERVER_ERROR,
                Constants.MESSAGES.ERROR.AUTH.AUTHENTICATION_FAILED
            );
        }
    }

    async verify2FA(user, token) {
        try {
            const userSecret = user.twoFactorSecret; // hashed secret from the database

            // check if the code is still valid
            const isVerified = speakeasy.totp.verify({
                secret: userSecret,
                encoding: 'base32',
                token
            });

            if (isVerified) {
                await this.usersRepository.update(user.id, { isTwoFactorEnabled: true });
                return res.json({ verified: true });
            }
            res.status(400).send({ verified: false, message: 'Código inválido.' });
            throw createError(
                httpStatus.UNAUTHORIZED,
                Constants.MESSAGES.ERROR.AUTH.AUTHENTICATION_FAILED
            );
        } catch (error) {
            console.error('Error verifying 2FA token:');
            console.error(error);
            throw createError(
                httpStatus.UNAUTHORIZED,
                Constants.MESSAGES.ERROR.AUTH.AUTHENTICATION_FAILED
            );
        }
    }

    async checkAuthentication(email, password) {
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

        return {
            userId: user.id,
            email: user.email,
            isTwoFactorEnabled: user.isTwoFactorEnabled
        };
    }
}
