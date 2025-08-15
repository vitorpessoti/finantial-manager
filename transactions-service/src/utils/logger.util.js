import 'dotenv/config';
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: process.env.DATE_FORMAT }),
        format.printf(info => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`)
    ),
    transports: [
        new transports.Console(), // shows on terminal
        new transports.File({ filename: process.env.LOGS_PATH }) // save in a file
    ]
});

module.exports = logger;
