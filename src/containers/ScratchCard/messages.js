import { defineMessages } from 'react-intl';

export default defineMessages({
    steps: {
        fillInForm: {
            id: 'steps.fillInForm',
            defaultMessage: 'FILL IN FORM'
        },
        result: {
            id: 'steps.result',
            defaultMessage: 'RESULT'
        }
    },
    placeholders: {
        selectTelco: {
            id: 'placeholders.selectTelco',
            defaultMessage: 'Please select telco name'
        },
        cardSerialNo: {
            id: 'placeholders.cardSerialNo',
            defaultMessage: 'Card Serial No.'
        },
        cardPin: {
            id: 'placeholders.cardPin',
            defaultMessage: 'Card Pin'
        }
    },
    texts: {
        submitCorrectCardDetails: {
            id: 'texts.submitCorrectCardDetails',
            defaultMessage: 'Please submit the correct amount, card pin and serial number.'
        },
        submitIncorrectCardDetails: {
            id: 'texts.submitIncorrectCardDetails',
            defaultMessage: 'If submitted with incorrect amount, member will be penalized.'
        }
    },
    errors: {
        connectionTimeout: {
            id: 'errors.connectionTimeout',
            defaultMessage: 'A server connection timeout error, please contact customer support for the transaction status.'
        }
    }
});