import TransactionsRepository from '../repositories/transactions.repository.js';
import httpStatus from 'http-status';
import createError from 'http-errors';
import { Constants } from '../utils/constants.util.js';
import RabbitMQService from './rabbit-mq.service.js';
import Logger from './logger.service.js';
import DatabaseService from './database.service.js';

const logger = new Logger({
    dateFormat: process.env.DATE_FORMAT,
    logsPath: process.env.LOGS_PATH
});

export default class TransactionsService {
    constructor() {
        this.repository = new TransactionsRepository();
        this.databaseService = new DatabaseService();
    }

    async createTransaction(data) {
        try {
            const isoDate = new Date(data.date).toISOString();
            const transactionBody = {
                ...data,
                date: isoDate
            }
            const createdTransaction = await this.repository.create(transactionBody);

            // Publish the transaction to RabbitMQ for further processing
            const rabbitMQService = new RabbitMQService(
                process.env.RABBITMQ_URL,
                process.env.DATE_FORMAT,
                process.env.LOGS_PATH
            );
            await rabbitMQService.connect();
            await rabbitMQService.sendToQueue(process.env.QUEUE_PENDING_TRANSACTIONS, transactionBody);
            logger.info(`Transaction created and sent to RabbitMQ: ${JSON.stringify(transactionBody.description)}`);

            return {
                message: Constants.MESSAGES.SUCCESS.TRANSACTIONS.CREATED,
                data: createdTransaction
            };
        } catch (error) {
            logger.error(`Error creating transaction: ${error.message}`);
            throw createError(httpStatus.BAD_REQUEST, error.message || Constants.MESSAGES.ERROR.TRANSACTIONS.DEFAULT);
        }
    }

    async listTransactionsByUser(userId) {
        return this.repository.findAllByUserId(userId);
    }

    async getTransactionById(id) {
        console.log(`Fetching transaction with ID: ${id}`);
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

    async processTransactions() {
        try {
            const rabbitMQService = new RabbitMQService(
                process.env.RABBITMQ_URL,
                process.env.DATE_FORMAT,
                process.env.LOGS_PATH
            );
            await rabbitMQService.connect();
            await rabbitMQService.consumeFromQueue(process.env.QUEUE_PROCESSED, async (msg) => {
                if (msg !== null) {
                    const transactionData = JSON.parse(msg.content.toString());
                    logger.info(`Processing transaction from queue: ${transactionData.description}`);
                    this.databaseService.addTransaction(transactionData);
                }
            });
            
            return {
                message: Constants.MESSAGES.SUCCESS.TRANSACTIONS.QUEUE_PROCESSED
            };
        } catch (error) {
            logger.error(`Error processing transactions: ${error.message}`);
            throw createError(
                httpStatus.INTERNAL_SERVER_ERROR,
                error.message || Constants.MESSAGES.ERROR.TRANSACTIONS.DEFAULT
            );
        }
    }
}
