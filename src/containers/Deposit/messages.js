import { defineMessages } from 'react-intl';

export default defineMessages({
    steps: {
        login: {
            id: 'steps.login',
            defaultMessage: 'LOGIN'
        },
        authorization: {
            id: 'steps.authorization',
            defaultMessage: 'AUTHORIZATION'
        },
        result: {
            id: 'steps.result',
            defaultMessage: 'RESULT'
        }
    },
    deposit: {
        id: 'deposit',
        defaultMessage: 'Deposit'
    },
    placeholders: {
        loginName: {
            id: 'placeholders.loginName',
            defaultMessage: 'Online banking login name'
        },
        password: {
            id: 'placeholders.password',
            defaultMessage: 'Password'
        },
        inputLoginName: {
            id: 'placeholders.inputLoginName',
            defaultMessage: 'Please input your online banking login name'
        },
        inputPassword: {
            id: 'placeholders.inputPassword',
            defaultMessage: 'Please input your password'
        },
        inputOtp: {
            id: 'placeholders.inputOtp',
            defaultMessage: 'Please input OTP received from bank'
        }
    },
    submit: {
        id: 'submit',
        defaultMessage: 'Submit'
    },
    moreInformation: {
        id: 'moreInformation',
        defaultMessage: 'More Information'
    },
    countdown: {
        id: 'countdown',
        defaultMessage: 'Countdown'
    },
    otpReference: {
        id: 'otpReference',
        defaultMessage: 'OTP Reference'
    },
    otpNewRecipient: {
        id: 'otpNewRecipient',
        defaultMessage: 'OTP for new recipient'
    },
    errors: {
        networkError: {
            id: 'errors.networkError',
            defaultMessage: 'Can\'t connect to server, please refresh your browser.'
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
        }
    }
});