import express from "express";
import httpStatus from "http-status";
import TransactionsService from "../services/transactions.service.js";
import TransactionsValidator from "../validators/transactions.validator.js";
import validate from "../middlewares/validate.middleware.js"; // Import validation middleware

const router = express.Router();

router.post(
    "/",
    ...TransactionsValidator.defaultValidation(),
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

router.get('/:userId', async (req, res, next) => {
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
    validate,
    async (req, res, next) => {
    try {
        const result = await new TransactionsService().updateTransaction(req.params.id, req.body);
        res.status(httpStatus.OK).json(result);
    } catch (error) {
        next(error);
    }
});

router.delete('/:userId', async (req, res, next) => {
    try {
        const result = await new TransactionsService().deleteTransaction(req.params.userId);
        res.status(httpStatus.OK).json(result);
    } catch (error) {
        next(error);
    }
});

export default router;