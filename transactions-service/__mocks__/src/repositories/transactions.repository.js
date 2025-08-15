// __mocks__/src/repositories/transactions.repository.js
export class TransactionsRepository {
    async findAllByUserId(userId) {
        // Simula o retorno do banco de dados sem acessá-lo.
        return [
            {
                id: 'mock-id-123',
                userId: userId,
                type: 'credit',
                description: 'Mocked Transaction',
                value: 100,
                category: 'Test',
                date: new Date(),
            },
        ];
    }
}