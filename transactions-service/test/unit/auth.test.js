import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';
import{ Constants } from '../../src/utils/constants.util.js';
import httpStatus from 'http-status';

const prisma = new PrismaClient();
const basePath = '/api/v1';

describe('Auth routes', () => {
    const testUser = { email: 'test@example.com', password: '123456', name: 'Test User' };

    beforeAll(async () => {
        await prisma.user.deleteMany({ where: { email: testUser.email } });
    });

    afterAll(async () => {
        // limpa usuário após os testes
        await prisma.user.deleteMany({ where: { email: testUser.email } });
        await prisma.$disconnect();
    });

    describe('POST /register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post(`${basePath}/auth/register`)
                .send(testUser);

            expect(res.statusCode).toBe(httpStatus.CREATED);
            expect(res.body).toHaveProperty('message', Constants.MESSAGES.SUCCESS.AUTH.REGISTERED);
            expect(res.body).toHaveProperty('id');
        });

        it('should fail if email already exists', async () => {
            const res = await request(app).post(`${basePath}/auth/register`).send(testUser);
            expect(res.statusCode).toBe(httpStatus.CONFLICT);
            expect(res.body).toHaveProperty('error', Constants.MESSAGES.ERROR.AUTH.EMAIL_EXISTS);
        });
    });

    describe('POST /login', () => {
        it('should login with correct credentials', async () => {
            const res = await request(app)
                .post(`${basePath}/auth/login`)
                .send({ email: testUser.email, password: testUser.password });

            expect(res.statusCode).toBe(httpStatus.OK);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', testUser.email);
        });

        it('should fail with wrong password', async () => {
            const res = await request(app)
                .post(`${basePath}/auth/login`)
                .send({ email: testUser.email, password: 'wrongpass' });

            expect(res.statusCode).toBe(httpStatus.UNAUTHORIZED);
            expect(res.body).toHaveProperty('error', Constants.MESSAGES.ERROR.AUTH.INVALID_CREDENTIALS);
        });

        it('should fail with non-existent email', async () => {
            const res = await request(app)
                .post(`${basePath}/auth/login`)
                .send({ email: 'noone@example.com', password: '123456' });

            expect(res.statusCode).toBe(httpStatus.UNAUTHORIZED);
            expect(res.body).toHaveProperty('error', Constants.MESSAGES.ERROR.AUTH.INVALID_CREDENTIALS);
        });
    });
});
