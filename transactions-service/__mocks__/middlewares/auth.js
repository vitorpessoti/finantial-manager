// __mocks__/middlewares/auth.js

export function authMiddleware(req, res, next) {
    // Pula toda a lógica de verificação de token.
    // Atribui um objeto de usuário mockado diretamente à requisição.
    req.user = {
        id: 'test-user-id',
        name: 'Usuário de Teste',
    };

    // Chama a próxima middleware, permitindo que o teste prossiga.
    next();
}