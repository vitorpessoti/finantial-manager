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
        res.json(result);
    } catch (err) {
        next(err);
    }
});

export default router;
