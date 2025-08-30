import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class UsersRepository {
    create(data) {
        return prisma.user.create({ data })
    }

    findByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    }

    findById(id) {
        return prisma.user.findUnique({ where: { id } });
    }

    async update(id, data) {
        return prisma.user.update({
            where: { id },
            data,
        });
    }
}
