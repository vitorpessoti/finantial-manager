import { validationResult } from "express-validator";
import Logger from "../services/logger.service.js";

const logger = new Logger({
    dateFormat: process.env.DATE_FORMAT,
    logsPath: process.env.LOGS_PATH
});

const validate = (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const errors = err.errors.map(error => error.msg);
        logger.warn(`Validation errors: ${JSON.stringify(errors)}`);
        return res.status(400).json({ errors });
    }
    next();
};

export default validate;