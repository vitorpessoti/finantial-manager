import request from 'supertest';
import app from '../../src/app';
import * as Constants from '../../src/utils/constants.util';

describe('Transactions - POST /transactions', () => {
    it('create a valid transaction', async () => {
        const response = await request(app)
            .post('/transactions')
            .send({
                userId: 'abc123',
                type: 'debit',
                description: 'Almoço',
                value: 32.5,
                category: 'Alimentação',
                date: '2025-07-29'
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.type).toBe('debit');
        expect(response.body.value).toBe(32.5);
    });

    it('should reject a transaction if value is negative or zero', async () => {
        const response = await request(app)
            .post('/transactions')
            .send({
                userId: 'abc123',
                type: 'credit',
                description: 'Pagamento',
                value: -50,
                category: 'Salário',
                date: '2025-07-29'
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe(Constants.MESSAGES.ERROR.TRANSACTIONS.INVALID_AMOUNT);
    });

    it('should reject a transaction if type is invalid', async () => {
        const response = await request(app)
            .post('/transactions')
            .send({
                userId: 'abc123',
                type: 'invalidType',
                description: 'Pagamento',
                value: 100,
                category: 'Salário',
                date: '2025-07-29'
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe(Constants.MESSAGES.ERROR.TRANSACTIONS.INVALID_TYPE);
    });

    it('should reject a transaction if userId is missing', async () => {
        const response = await request(app)
            .post('/transactions')
            .send({
                type: 'debit',
                description: 'Almoço',
                value: 32.5,
                category: 'Alimentação',
                date: '2025-07-29'
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe(Constants.MESSAGES.ERROR.TRANSACTIONS.MISSING_USER_ID);
    });

    it('should reject a transaction if date is in the future', async () => {
        const response = await request(app)
            .post('/transactions')
            .send({
                userId: 'abc123',
                type: 'debit',
                description: 'Compra',
                value: 20,
                category: 'Compras',
                date: '2025-12-31' // Future date
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe(Constants.MESSAGES.ERROR.TRANSACTIONS.INVALID_DATE);
    });

    it('should reject a transaction if any other required field is missing', async () => {
        const response = await request(app)
            .post('/transactions')
            .send({
                userId: 'abc123',
                type: 'debit',
                value: 50,
                category: 'Alimentação'
                // Missing description and date
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });
});