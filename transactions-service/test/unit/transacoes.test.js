import request from 'supertest';
import app from '../../src/app';
import { Constants } from '../../src/utils/constants.util';
import { PrismaClient } from '@prisma/client';
import httpStatus from 'http-status';

const prisma = new PrismaClient();
const basePath = '/api/v1';

afterAll(async () => {
    await prisma.$disconnect();
});

afterEach(async () => {
    await prisma.transactions.deleteMany({
        where: {
            userId: { startsWith: 'test-' }
        }
    });
});

describe('Transactions - POST /transactions', () => {
    it('create a valid transaction', async () => {
        const payload = {
            userId: 'test-create-1',
            type: 'credit',
            description: 'Salário',
            value: 3000,
            category: 'Trabalho',
            date: '2025-07-29'
        };

        const response = await request(app)
            .post(`${basePath}/transactions`)
            .send(payload);

        expect(response.status).toBe(httpStatus.CREATED);
        expect(response.body).not.toBeNull();
        expect(response.body).toHaveProperty('message', Constants.MESSAGES.SUCCESS.TRANSACTIONS.CREATED);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.description).toBe(payload.description);
    });

    it('should reject a transaction if value is negative or zero', async () => {
        const response = await request(app)
            .post(`${basePath}/transactions`)
            .send({
                userId: 'abc123',
                type: 'credit',
                description: 'Pagamento',
                value: -50,
                category: 'Salário',
                date: '2025-07-29'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors[0]).toBe(Constants.MESSAGES.ERROR.TRANSACTIONS.INVALID_AMOUNT);
    });

    it('should reject a transaction if type is invalid', async () => {
        const response = await request(app)
            .post(`${basePath}/transactions`)
            .send({
                userId: 'abc123',
                type: 'invalidType',
                description: 'Pagamento',
                value: 100,
                category: 'Salário',
                date: '2025-07-29'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors[0]).toBe(Constants.MESSAGES.ERROR.TRANSACTIONS.INVALID_TYPE);
    });

    it('should reject a transaction if date is in the future', async () => {
        const response = await request(app)
            .post(`${basePath}/transactions`)
            .send({
                userId: 'abc123',
                type: 'debit',
                description: 'Compra',
                value: 20,
                category: 'Compras',
                date: '2030-12-31' // Future date
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors[0]).toBe(Constants.MESSAGES.ERROR.TRANSACTIONS.INVALID_DATE);
    });

    it('should reject a transaction if type is missing', async () => {
        const response = await request(app)
            .post(`${basePath}/transactions`)
            .send({
                userId: 'abc123',
                description: 'Pagamento',
                value: -50,
                category: 'Salário',
                date: '2025-07-29'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors[0]).toBe(Constants.MESSAGES.ERROR.TRANSACTIONS.MISSING_TYPE);
    });

    it('should reject a transaction if description is missing', async () => {
        const response = await request(app)
            .post(`${basePath}/transactions`)
            .send({
                userId: 'abc123',
                type: 'debit',
                value: 32.5,
                category: 'Alimentação',
                date: '2025-07-29'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors[0]).toBe(Constants.MESSAGES.ERROR.TRANSACTIONS.MISSING_DESCRIPTION);
    });

    it('should reject a transaction if value is missing', async () => {
        const response = await request(app)
            .post(`${basePath}/transactions`)
            .send({
                userId: 'abc123',
                type: 'debit',
                description: 'Almoço',
                category: 'Alimentação',
                date: '2025-07-29'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors[0]).toBe(Constants.MESSAGES.ERROR.TRANSACTIONS.MISSING_VALUE);
    });

    it('should reject a transaction if date is missing', async () => {
        const response = await request(app)
            .post(`${basePath}/transactions`)
            .send({
                userId: 'abc123',
                type: 'debit',
                description: 'Almoço',
                value: 32.5,
                category: 'Alimentação'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors[0]).toBe(Constants.MESSAGES.ERROR.TRANSACTIONS.MISSING_DATE);
    });
});

describe('Transactions - GET /transactions', () => {
    it('should list transactions by user ID', async () => {
        const userId = 'test-abc123';
        const transaction = await prisma.transactions.create({
            data: {
                userId,
                type: 'credit',
                description: 'Test Transaction',
                value: 100,
                category: 'Test',
                date: new Date()
            }
        });

        const response = await request(app)
            .get(`${basePath}/transactions/${userId}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0].id).toBe(transaction.id);
    });

    it('should return an empty array if no transactions found for user ID', async () => {
        const response = await request(app)
            .get(`${basePath}/transactions/nonexistent-user`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual([]);
    });
});

describe('Transactions - PATCH /transactions/:id', () => {
    it('should update a transaction', async () => {
        const transaction = await prisma.transactions.create({
            data: {
                userId: 'test-update-1',
                type: 'debit',
                description: 'Old Description',
                value: 50,
                category: 'Test',
                date: new Date()
            }
        });

        const updateData = {
            description: 'Updated Description',
            value: 75
        };

        const response = await request(app)
            .patch(`${basePath}/transactions/${transaction.id}`)
            .send(updateData);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toHaveProperty('message', Constants.MESSAGES.SUCCESS.TRANSACTIONS.UPDATED);
        expect(response.body.data.description).toBe(updateData.description);
        expect(response.body.data.value).toBe(updateData.value);

        const updatedTransaction = await prisma.transactions.findUnique({
            where: { id: transaction.id }
        });

        expect(updatedTransaction.description).toBe(updateData.description);
        expect(updatedTransaction.value).toBe(updateData.value);
    });

    it('should return 404 if transaction not found', async () => {
        const response = await request(app)
            .patch(`${basePath}/transactions/nonexistent-id`)
            .send({ description: 'New Description' });

        expect(response.status).toBe(httpStatus.NOT_FOUND);
        expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if update data is invalid', async () => {
        const transaction = await prisma.transactions.create({
            data: {
                userId: 'test-invalid-update',
                type: 'credit',
                description: 'Test Transaction',
                value: 100,
                category: 'Test',
                date: new Date()
            }
        });

        const response = await request(app)
            .patch(`${basePath}/transactions/${transaction.id}`)
            .send({ value: -50 });

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors[0]).toBe(Constants.MESSAGES.ERROR.TRANSACTIONS.INVALID_AMOUNT);
    });

    it('should not allow updating userId', async () => {
        const transaction = await prisma.transactions.create({
            data: {
                userId: 'test-user-update',
                type: 'credit',
                description: 'Test Transaction',
                value: 100,
                category: 'Test',
                date: new Date()
            }
        });

        const response = await request(app)
            .patch(`${basePath}/transactions/${transaction.id}`)
            .send({ userId: 'new-user-id' });

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors[0]).toBe(Constants.MESSAGES.ERROR.TRANSACTIONS.CANNOT_UPDATE_USER_ID);
    });
});

describe('Transactions - DELETE /transactions/:id', () => {
    it('should delete a transaction', async () => {
        const transaction = await prisma.transactions.create({
            data: {
                userId: 'test-delete-1',
                type: 'debit',
                description: 'Transaction to delete',
                value: 100,
                category: 'Test',
                date: new Date()
            }
        });

        const response = await request(app)
            .delete(`${basePath}/transactions/${transaction.id}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toHaveProperty('message', Constants.MESSAGES.SUCCESS.TRANSACTIONS.DELETED);
        expect(response.body.data.id).toBe(transaction.id);

        const deletedTransaction = await prisma.transactions.findUnique({
            where: { id: transaction.id }
        });

        expect(deletedTransaction).toBeNull();
    });

    it('should return 404 if transaction not found for deletion', async () => {
        const response = await request(app)
            .delete(`${basePath}/transactions/nonexistent-id`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
        expect(response.body).toHaveProperty('error');
    });
});