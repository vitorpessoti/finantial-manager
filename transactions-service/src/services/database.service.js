import fs from 'fs';
import Logger from './logger.service.js';

export default class DatabaseService {
    constructor(dbFilePath) {
        this.file = dbFilePath || 'database.json';
        this.logger = new Logger();
    }

    async addTransaction(transaction) {
        try {
            const databaseContent = await this.getTransactions();
            const transactions = databaseContent.transactions;
            transactions.push(transaction);
            const newContent = {
                ...databaseContent,
                transactions
            }
            fs.writeFileSync(this.file, JSON.stringify(newContent, null, 2));
            return transaction;
        } catch (error) {
            console.error('Error adding transaction:', error);
            throw error;
        }
    }

    async getTransactions() {
        try {
            if (!fs.existsSync(this.file)) {
                const defaultContent = {
                    transactions: []
                }
                fs.writeFileSync(this.file, JSON.stringify(defaultContent));
            }
            const transactions = fs.readFileSync(this.file, 'utf-8');
            return JSON.parse(transactions);
        } catch (error) {
            console.error('Error getting transactions:', error);
            throw error;
        }
    }

    async updateTransaction(updatedTransaction) {
        try {
            const databaseContent = await this.getTransactions();
            let transactions = databaseContent.transactions;
            transactions = transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t);
            const newContent = {
                ...databaseContent,
                transactions
            }
            fs.writeFileSync(this.file, JSON.stringify(newContent, null, 2));
            return updatedTransaction;
        } catch (error) {
            console.error('Error updating transaction:', error);
            throw error;
        }
    }

    async deleteTransaction(transactionId) {
        try {
            const databaseContent = await this.getTransactions();
            let transactions = databaseContent.transactions;
            transactions = transactions.filter(t => t.id !== transactionId);
            const newContent = {
                ...databaseContent,
                transactions
            }
            fs.writeFileSync(this.file, JSON.stringify(newContent, null, 2));
        } catch (error) {
            console.error('Error deleting transaction:', error);
            throw error;
        }
    }
}