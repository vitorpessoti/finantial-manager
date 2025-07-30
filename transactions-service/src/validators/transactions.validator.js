import { body } from 'express-validator';

class PlayersUpdateValidator {
    static defaultValidation() {
        return [
            body('team')
                .exists()
                .withMessage('Nome do time é um parâmetro obrigatório.'),

            body('comparativo')
                .exists()
                .withMessage('Comparativo tabela é um parâmetro obrigatório.')
        ]
    }
}

export default PlayersUpdateValidator;