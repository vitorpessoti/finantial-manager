import TransactionsRepository from '../repositories/transactions.repository.js';
import httpStatus from 'http-status';
import createError from 'http-errors';
import { Constants } from '../utils/constants.util.js';

export default class TransactionsService {
    constructor() {
        this.repository = new TransactionsRepository();
    }

    async createTransaction(data) {
        try {
            const isoDate = new Date(data.date).toISOString();
            const createdTransaction = await this.repository.create({
                ...data,
                date: isoDate
            });
            return {
                message: Constants.MESSAGES.SUCCESS.TRANSACTIONS.CREATED,
                data: createdTransaction
            };
        } catch (error) {
            throw createError(httpStatus.BAD_REQUEST, error.message || Constants.MESSAGES.ERROR.TRANSACTIONS.DEFAULT);
        }
    }

    async listTransactionsByUser(userId) {
        return this.repository.findAllByUserId(userId);
    }

    async getTransactionById(id) {
        return this.repository.findById(id);
    }

    async deleteTransaction(id) {
        try {
            const existingTransaction = await this.repository.findById(id);
            if (!existingTransaction)
                throw createError(httpStatus.NOT_FOUND, Constants.MESSAGES.ERROR.TRANSACTIONS.NOT_FOUND);

            const deletedTransaction = await this.repository.delete(id)
            return {
                message: Constants.MESSAGES.SUCCESS.TRANSACTIONS.DELETED,
                data: deletedTransaction
            };
        } catch (error) {
            throw createError(
                error.status || httpStatus.BAD_REQUEST,
                error.message || Constants.MESSAGES.ERROR.TRANSACTIONS.DEFAULT
            );
        }
    }

    async updateTransaction(id, data) {
        try {
            const existingTransaction = await this.repository.findById(id);
            if (!existingTransaction)
                throw createError(httpStatus.NOT_FOUND, Constants.MESSAGES.ERROR.TRANSACTIONS.NOT_FOUND);

            const updatedTransaction = await this.repository.update(id, data);
            return {
                message: Constants.MESSAGES.SUCCESS.TRANSACTIONS.UPDATED,
                data: updatedTransaction
            };
        } catch (error) {
            throw createError(
                error.status || httpStatus.BAD_REQUEST,
                error.message || Constants.MESSAGES.ERROR.TRANSACTIONS.DEFAULT
            );
        }
    }
}
