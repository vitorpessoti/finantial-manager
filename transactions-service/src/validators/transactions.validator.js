import { body } from 'express-validator';
import { Constants } from '../utils/constants.util.js';
import moment from 'moment';

class PlayersUpdateValidator {
    static defaultValidation() {
        return [
            body('type')
                .exists()
                .withMessage(Constants.MESSAGES.ERROR.TRANSACTIONS.MISSING_TYPE)
                .notEmpty()
                .withMessage(Constants.MESSAGES.ERROR.TRANSACTIONS.MISSING_TYPE),

            body('description')
                .exists()
                .withMessage(Constants.MESSAGES.ERROR.TRANSACTIONS.MISSING_DESCRIPTION)
                .notEmpty()
                .withMessage(Constants.MESSAGES.ERROR.TRANSACTIONS.MISSING_DESCRIPTION),

            body('value')
                .exists()
                .withMessage(Constants.MESSAGES.ERROR.TRANSACTIONS.MISSING_VALUE)
                .notEmpty()
                .withMessage(Constants.MESSAGES.ERROR.TRANSACTIONS.MISSING_VALUE),

            body('date')
                .exists()
                .withMessage(Constants.MESSAGES.ERROR.TRANSACTIONS.MISSING_DATE)
                .notEmpty()
                .withMessage(Constants.MESSAGES.ERROR.TRANSACTIONS.MISSING_DATE),

            body('value')
                .isFloat({ gt: 0 })
                .withMessage(Constants.MESSAGES.ERROR.TRANSACTIONS.INVALID_AMOUNT),

            body('type')
                .isIn(['debit', 'credit'])
                .withMessage(Constants.MESSAGES.ERROR.TRANSACTIONS.INVALID_TYPE),

            body('date')
                .custom((value) => {
                    const transactionDate = moment(value);
                    const currentDate = moment();
                    const isSameOrBefore = transactionDate.isSameOrBefore(currentDate)
                    return isSameOrBefore;
                })
                .withMessage(Constants.MESSAGES.ERROR.TRANSACTIONS.INVALID_DATE)
        ]
    }

    static updateValidation() {
        return [
            body('type')
                .optional()
                .isIn(['debit', 'credit'])
                .withMessage(Constants.MESSAGES.ERROR.TRANSACTIONS.INVALID_TYPE),
                
            body('description')
                .optional()
                .notEmpty()
                .withMessage(Constants.MESSAGES.ERROR.TRANSACTIONS.MISSING_DESCRIPTION),

            body('value')
                .optional()
                .isFloat({ gt: 0 })
                .withMessage(Constants.MESSAGES.ERROR.TRANSACTIONS.INVALID_AMOUNT),

            body('date')
                .optional()
                .custom((value) => {
                    const transactionDate = moment(value);
                    const currentDate = moment();
                    const isSameOrBefore = transactionDate.isSameOrBefore(currentDate)
                    return isSameOrBefore;
                })
                .withMessage(Constants.MESSAGES.ERROR.TRANSACTIONS.INVALID_DATE)
        ]
    }
}

export default PlayersUpdateValidator;