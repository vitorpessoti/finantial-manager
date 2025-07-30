import { validationResult } from "express-validator";

const validate = (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const errors = err.errors.map(error => error.msg);
        return res.status(400).json({ errors });
    }
    next();
};

export default validate;