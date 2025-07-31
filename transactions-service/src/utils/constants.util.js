export const Constants = {
    MESSAGES: {
        SUCCESS: {
            TRANSACTIONS: {
                CREATED: "Transação criada com sucesso.",
                UPDATED: "Transação atualizada com sucesso.",
                DELETED: "Transação excluída com sucesso.",
            }
        },
        ERROR: {
            TRANSACTIONS: {
                DEFAULT: "Ocorreu um erro ao processar a transação.",
                NOT_FOUND: "Transação não encontrada.",
                INVALID_AMOUNT: "O valor da transação deve ser um número positivo.",
                INVALID_TYPE: "O tipo de transação deve ser 'debit' ou 'credit'.",
                INVALID_DATE: "A data da transação não pode ser maior que a data atual.",
                MISSING_TYPE: "O campo type é obrigatório.",
                MISSING_DESCRIPTION: "O campo description é obrigatório.",
                MISSING_VALUE: "O campo value é obrigatório.",
                MISSING_DATE: "O campo date é obrigatório.",
                CANNOT_UPDATE_USER_ID: "O campo userId não pode ser atualizado."
            }
        }
    }
}