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
        },
        inputMaxChar: {
            id: 'placeholders.inputMaxChar',
            defaultMessage: 'Please input a maximum length of {maxLength} characters.'
        },
        inputSerialNumber: {
            id: 'placeholders.inputSerialNumber',
            defaultMessage: 'Please input serial number.'
        },
        telcoName: {
            id: 'placeholders.telcoName',
            defaultMessage: 'Telco Name'
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
        },
        networkError: {
            id: 'errors.networkError',
            defaultMessage: "Can't connect to server, please refresh your browser."
        },
        networkErrorTitle: {
            id: 'errors.networkErrorTitle',
            defaultMessage: 'Network Error'
        },
        connectionError: {
            id: 'errors.connectionError',
            defaultMessage: 'Connection is closed, please refresh the page.'
        }
    },
    progress: {
        inProgress: {
            id: 'progress.inProgress',
            defaultMessage: 'In progress'
        },
        waitingForProvider: {
            id: 'progress.waitingForProvider',
            defaultMessage: 'Waiting for provider confirmation'
        },
        transactionComplete: {
            id: 'progress.transactionComplete',
            defaultMessage: 'Transaction Complete'
        }
    },
    submit: {
        id: 'submit',
        defaultMessage: 'Submit'
    },
    deposit: {
        id: 'deposit',
        defaultMessage: 'Deposit'
    }
});