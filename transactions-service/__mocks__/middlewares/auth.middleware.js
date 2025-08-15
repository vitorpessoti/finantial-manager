export const authMiddleware = (req, res, next) => {
    req.user = { id: 'test-get-1' };
    next();
};