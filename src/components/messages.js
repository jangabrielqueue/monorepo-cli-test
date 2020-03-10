import { defineMessages } from 'react-intl';

export default defineMessages({
    texts: {
        redirected: {
            id: 'texts.redirected',
            defaultMessage: 'You will be redirected in {timeLeft} seconds'
        }
    },
    success: {
        successfullyDeposit: {
            id: 'success.successfullyDeposit',
            defaultMessage: 'Successfully Deposited!'
        }
    },
    errors: {
        transactionFailed: {
            id: 'errors.transactionFailed',
            defaultMessage: 'Submitted Transaction Failed!'
        },
        submissionFailed: {
            id: 'errors.submissionFailed',
            defaultMessage: 'Submission Failed!'
        },
        invalidParameters: {
            id: 'errors.invalidParameters',
            defaultMessage: 'Invalid Parameters'
        },
        pageDoesNoExist: {
            id: 'errors.pageDoesNoExist',
            defaultMessage: 'Sorry, the page you have visited does not exist'
        }
    },
    progress: {
        pendingConfirmation: {
            id: 'progress.pendingConfirmation',
            defaultMessage: 'Transaction is pending for confirmation.'
        }
    }
});