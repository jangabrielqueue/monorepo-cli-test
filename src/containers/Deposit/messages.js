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
  pleaseUseMandiri: {
    id: 'pleaseUseMandiri',
    defaultMessage: 'Please use your Mandiri Online Application to approve the transaction.'
  },
  clickDone: {
    id: 'clickDone',
    defaultMessage: 'Click on DONE if you have done the approval.'
  },
  done: {
    id: 'done',
    defaultMessage: 'Done'
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
    inputOtpDAB: {
      id: 'placeholders.inputOtpDAB',
      defaultMessage: 'Please input a 3 digit number'
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
  },
  important: {
    note: {
      id: 'important.note',
      defaultMessage: 'IMPORTANT NOTE'
    },
    keyIn: {
      id: 'important.keyIn',
      defaultMessage: 'Please key-in the exact amount generated in the screen for faster and smooth transaction.'
    },
    noRefresh: {
      id: 'important.noRefresh',
      defaultMessage: 'Please do not refresh your browser.'
    },
    noSave: {
      id: 'important.noSave',
      defaultMessage: 'Please do not save old QRcode.'
    },
    verificationInstruction: {
      id: 'important.verificationInstruction',
      defaultMessage: 'Verification Instruction:'
    },
    openAppNoLogin: {
      id: 'important.openAppNoLogin',
      defaultMessage: 'Please open the application and do not login'
    },
    smartOtp: {
      id: 'important.smartOtp',
      defaultMessage: 'Select function Smart OTP'
    },
    scanQR: {
      id: 'important.scanQR',
      defaultMessage: 'Scan the QR code above and verify transaction'
    }
  },
  bidvNotifications: {
    transactionWaiting: {
      id: 'bidvNotifications.transactionWaiting',
      defaultMessage: 'The transaction is waiting for being verified via Smart OTP on SmartBanking application on mobile channel'
    },
    remainingTime: {
      id: 'bidvNotifications.remainingTime',
      defaultMessage: 'Remaining time for verification {timerSeconds} seconds'
    },
    dontCloseBrowser: {
      id: 'bidvNotifications.dontCloseBrowser',
      defaultMessage: 'Please do not close your browser until you receive transaction result on Internet Banking. Thank you!'
    }
  },
  bcaOtpReference: {
    pleaseKeyInDigit: {
      id: 'bcaOtpReference.pleaseKeyInDigit',
      defaultMessage: 'PLEASE KEY IN THE {digit} DIGIT NUMBER INTO YOUR KEYBCA'
    },
    pleaseInputOtp: {
      id: 'bcaOtpReference.pleaseInputOtp',
      defaultMessage: 'KEYBCA RESPONSE APPLI {number}'
    }
  }
})
