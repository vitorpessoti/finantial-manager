import DatabaseService from "../../src/services/database.service";
import fs from 'fs';

describe('# Internal Database', () => {
    const testPath = 'test-db.json';
    const dbService = new DatabaseService(testPath);

    afterAll(() => {
        if (fs.existsSync(testPath))
            fs.unlinkSync(testPath);
    });

    it('should add a transaction', async () => {
        const newTransaction = { id: 'transaction-to-be-added', amount: 100, type: 'credit' };
        const addedTransaction = await dbService.addTransaction(newTransaction);
        expect(addedTransaction).toEqual(newTransaction);

        const databaseContent = await dbService.getTransactions();
        expect(databaseContent).toHaveProperty('transactions');
        expect(databaseContent.transactions).toContainEqual(newTransaction);
    });

    it('should load data correctly', async () => {
        const transactions = await dbService.getTransactions();
        expect(transactions).toBeDefined();
    });

    it('should update a transaction', async () => {
        const transactionToUpdate = { id: 'transaction-to-be-updated', amount: 200, type: 'credit' };
        await dbService.addTransaction(transactionToUpdate);

        let databaseContent = await dbService.getTransactions();
        expect(databaseContent.transactions).toContainEqual(transactionToUpdate);

        // Update the transaction
        const updatedTransaction = { ...transactionToUpdate, amount: 300 };
        await dbService.updateTransaction(updatedTransaction);

        databaseContent = await dbService.getTransactions();
        expect(databaseContent.transactions).toContainEqual(updatedTransaction);
    });

    it('should delete a transaction', async () => {
        const transactionToDelete = { id: 'transaction-to-be-deleted', amount: 50, type: 'debit' };
        await dbService.addTransaction(transactionToDelete);

        let databaseContent = await dbService.getTransactions();
        expect(databaseContent.transactions).toContainEqual(transactionToDelete);

        await dbService.deleteTransaction(transactionToDelete.id);

        databaseContent = await dbService.getTransactions();
        expect(databaseContent.transactions).not.toContainEqual(transactionToDelete);
    });

    it('should handle deletion of non-existent transaction gracefully', async () => {
        const nonExistentId = 'non-existent-id';
        await expect(dbService.deleteTransaction(nonExistentId)).resolves.not.toThrow();

        const databaseContent = await dbService.getTransactions();
        expect(databaseContent).toHaveProperty('transactions');
    });
});