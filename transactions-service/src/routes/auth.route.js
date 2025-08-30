import { Router } from 'express';
import AuthService from '../services/auth.service.js';
import httpStatus from 'http-status';
import { Constants } from '../utils/constants.util.js';

const router = Router();
const authService = new AuthService();

router.post('/register', async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        res.status(httpStatus.CREATED).json({
            message: Constants.MESSAGES.SUCCESS.AUTH.REGISTERED,
            id: user.id
        });
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);

        if (result && result.qrCodeUrl) {
            return res.status(httpStatus.OK).json(result);
        }

        res.cookie('auth-token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000 // 1 hour
        });
        delete result.token;

        res.status(httpStatus.OK).json(result);
    } catch (err) {
        next(err);
    }
});

router.post('/logout', async (req, res, next) => {
    try {
        const result = await authService.logout(res);
        res.status(httpStatus.OK).json(result);
    } catch (err) {
        next(err);
    }
});

router.post('/2fa/enable', async (req, res) => {
    try {
        const result = await authService.enable2FA(req.user);
        res.status(httpStatus.OK).json(result);
    } catch (err) {
        next(err);
    }
});

router.post('/2fa/user/enable', async (req, res) => {
    try {
        const result = await authService.enableUser2FA(req.body.userId);
        res.status(httpStatus.OK).json(result);
    } catch (err) {
        next(err);
    }
});

router.post('/2fa/verify', async (req, res) => {
    try {
        const result = await authService.verify2FA(req.user, req.body.token);
        res.status(httpStatus.OK).json(result);
    } catch (err) {
        next(err);
    }
});

router.post('/2fa/login', async (req, res, next) => {
    try {
        const { userId, twoFactorToken } = req.body;
        const result = await authService.loginWith2FA(userId, twoFactorToken);

        if (result.qrCodeUrl)
            return res.status(httpStatus.OK).json(result);

        res.cookie('auth-token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000 // 1 hour
        });
        delete result.token;
        res.status(httpStatus.OK).json(result);
    } catch (error) {
        next(error);
    }
});

export default router;
