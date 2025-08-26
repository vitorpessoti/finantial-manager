import express from "express";
import httpStatus from "http-status";
import TransactionsService from "../services/transactions.service.js";
import TransactionsValidator from "../validators/transactions.validator.js";
import validate from "../middlewares/validate.middleware.js"; // Import validation middleware
import { authMiddleware } from "../middlewares/auth.middleware.js"; // Import authentication middleware

const router = express.Router();

router.post(
    "/",
    ...TransactionsValidator.defaultValidation(),
    authMiddleware,
    validate,
    async (req, res, next) => {
        try {
            const result = await new TransactionsService().createTransaction(req.body);
            res.status(httpStatus.CREATED).json(result);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/:id', authMiddleware, async (req, res, next) => {
    try {
        const result = await new TransactionsService().getTransactionById(req.params.id);
        res.status(httpStatus.OK).json(result);
    } catch (error) {
        next(error);
    }
});

router.get('/users/:userId', authMiddleware, async (req, res, next) => {
    try {
        const result = await new TransactionsService().listTransactionsByUser(req.params.userId);
        res.status(httpStatus.OK).json(result);
    } catch (error) {
        next(error);
    }
});

router.patch(
    '/:id',
    ...TransactionsValidator.updateValidation(),
    authMiddleware,
    validate,
    async (req, res, next) => {
    try {
        const result = await new TransactionsService().updateTransaction(req.params.id, req.body);
        res.status(httpStatus.OK).json(result);
    } catch (error) {
        next(error);
    }
});

router.delete('/:userId', authMiddleware, async (req, res, next) => {
    try {
        const result = await new TransactionsService().deleteTransaction(req.params.userId);
        res.status(httpStatus.OK).json(result);
    } catch (error) {
        next(error);
    }
});

router.post(
    "/pending/process",
    authMiddleware,
    async (req, res, next) => {
        try {
            const result = await new TransactionsService().processTransactions();
            res.status(httpStatus.OK).json(result);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    "/all/processed",
    authMiddleware,
    async (req, res, next) => {
        try {
            const result = await new TransactionsService().listTransactionsByUser(req.user.userId);
            res.status(httpStatus.OK).json(result);
        } catch (error) {
            next(error);
        }
    }
);

export default router;