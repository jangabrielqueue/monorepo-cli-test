import { defineMessages } from 'react-intl'

export default defineMessages({
  deposit: {
    id: 'deposit',
    defaultMessage: 'Deposit'
  },
  secureBankingTitle: {
    id: 'secureBankingTitle',
    defaultMessage: 'Secure Online Banking:'
  },
  secureBankingText: {
    id: 'secureBankingText',
    defaultMessage: 'Please use your Internet Banking account and password to log in.'
  },
  reference: {
    id: 'reference',
    defaultMessage: 'Reference'
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
  importantNotes: {
    id: 'importantNotes',
    defaultMessage: 'Important Notes:'
  },
  importantNotesText: {
    kindlyEnsureActivated: {
      id: 'importantNotesText.kindlyEnsureActivated',
      defaultMessage: 'Kindly ensure your bank account has been activated for online payment processing.'
    },
    doNotSubmitMoreThanOne: {
      id: 'importantNotesText.doNotSubmitMoreThanOne',
      defaultMessage: 'Please do not click on any submit button more than once.'
    },
    doNotRefresh: {
      id: 'importantNotesText.doNotRefresh',
      defaultMessage: 'Please do not refresh your browser.'
    },
    takeNoteReference: {
      id: 'importantNotesText.takeNoteReference',
      defaultMessage: 'Please take note of the Bank reference number if any case you need to contact our Customer Service for further verification.'
    }
  },
  countdown: {
    id: 'countdown',
    defaultMessage: 'Countdown'
  },
  otpReference: {
    id: 'otpReference',
    defaultMessage: 'OTP Reference'
  },
  otpDABLabel: {
    id: 'otpDABLabel',
    defaultMessage: 'Please enter the value at position 2 numeric box on the Authentication Card'
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
