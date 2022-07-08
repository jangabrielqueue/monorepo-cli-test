import { defineMessages } from 'react-intl'

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
    inputCardPin: {
      id: 'placeholders.inputSerialNumber',
      defaultMessage: 'Please input card pin.'
    },
    inputSerialNumber: {
      id: 'placeholders.inputSerialNumber',
      defaultMessage: 'Please input serial number.'
    },
    telcoName: {
      id: 'placeholders.telcoName',
      defaultMessage: 'Telco Name'
    },
    inputPattern: {
      id: 'placeholders.inputPattern',
      defaultMessage: 'First {numberLetter} are letters and the next {digitNumber} digits are numbers.'
    }
  },
  notes: {
    notesOne: {
      id: 'notes.notesOne',
      defaultMessage: 'For loading money from scratch card, member will shoulder a transaction fee.'
    },
    notesTwo: {
      id: 'notes.notesTwo',
      defaultMessage: 'Please submit the correct amount, card number and serial number. If input incorrect details, we will not credit deposit amount.'
    },
    notesThree: {
      id: 'notes.notesThree',
      defaultMessage: 'If submitted with incorrect amount, will return the lower value between request amount and real amount'
    },
    notesFour: {
      id: 'notes.notesFour',
      defaultMessage: 'Request amount < real amount, will return request amount + penalised 2% of Request amount.'
    },
    notesFive: {
      id: 'notes.notesFive',
      defaultMessage: 'Request amount > real amount, will return real amount + penalized 15% of the received amount.'
    },
    notesSix: {
      id: 'notes.notesSix',
      defaultMessage: 'Transaction Fee:'
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
  submit: {
    id: 'submit',
    defaultMessage: 'Submit'
  },
  deposit: {
    id: 'deposit',
    defaultMessage: 'Deposit'
  }
})
