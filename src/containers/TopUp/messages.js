import { defineMessages } from 'react-intl'

export default defineMessages({
  deposit: {
    id: 'deposit',
    defaultMessage: 'Deposit'
  },
  placeholders: {
    loginName: {
      id: 'placeholders.loginName',
      defaultMessage: 'Online Banking Login Name'
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
    },
    bankName: {
      id: 'placeholders.bankName',
      defaultMessage: 'Bank Name'
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
    },
    verificationFailed: {
      id: 'errors.verificationFailed',
      defaultMessage: 'Verification failed. Please check again.'
    }
  },
  progress: {
    startingConnection: {
      id: 'progress.startingConnection',
      defaultMessage: 'Starting secured connection'
    },
    encryptedTransmission: {
      id: 'progress.encryptedTransmission',
      defaultMessage: 'Encrypted the transmission data'
    },
    beginningTransaction: {
      id: 'progress.beginningTransaction',
      defaultMessage: 'Beginning of the transaction'
    },
    submittingTransaction: {
      id: 'progress.submittingTransaction',
      defaultMessage: 'Submitting transaction via secured connection'
    },
    waitingTransaction: {
      id: 'progress.waitingTransaction',
      defaultMessage: 'Waiting transaction confirm'
    }
  }
})
