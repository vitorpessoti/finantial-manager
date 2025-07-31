import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class TransactionsRepository {
    async create(data) {
        return prisma.transactions.create({
            data,
        });
    }

    async findAllByUserId(userId) {
        return prisma.transactions.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
        });
    }

    async findById(id) {
        return prisma.transactions.findUnique({
            where: { id },
        });
    }

    async delete(id) {
        return prisma.transactions.delete({
            where: { id },
        });
    }

    async update(id, data) {
        return prisma.transactions.update({
            where: { id },
            data,
        });
    }
}
