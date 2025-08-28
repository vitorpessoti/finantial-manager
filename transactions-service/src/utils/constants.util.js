export const Constants = {
    MESSAGES: {
        SUCCESS: {
            TRANSACTIONS: {
                CREATED: "Transaction successfully created. Wait for processing.",
                UPDATED: "Transaction successfully updated. Wait for processing.",
                DELETED: "Transaction successfully deleted. Wait for processing.",
                QUEUE_PROCESSED: "Queue processing started successfully."
            },
            AUTH: {
                REGISTERED: "User registered successfully.",
                LOGGED_IN: "Successfully logged in."
            }
        },
        ERROR: {
            TRANSACTIONS: {
                DEFAULT: "There was an error while processing transaction.",
                NOT_FOUND: "Transactoin not found.",
                INVALID_AMOUNT: "Transaction value must be greater than zero.",
                INVALID_TYPE: "Transaction type must be 'debit' or 'credit'.",
                INVALID_DATE: "The date cannot be greater than today.",
                MISSING_TYPE: "Type is required.",
                MISSING_DESCRIPTION: "Description is required.",
                MISSING_VALUE: "Value is required.",
                MISSING_DATE: "Date is required.",
                MISSING_UNIQUE_ID: "Unique ID is required.",
                CANNOT_UPDATE_USER_ID: "The user id cannot be updated."
            },
            AUTH: {
                INVALID_CREDENTIALS: "Invalid credentials.",
                EMAIL_EXISTS: "Email already in use.",
            }
        }
    }
}