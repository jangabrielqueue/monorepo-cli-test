import { defineMessages } from 'react-intl'

export default defineMessages({
  placeholders: {
    fullName: {
      id: 'placeholders.fullName',
      defaultMessage: 'Please enter full name'
    },
    inputFullName: {
      id: 'placeholders.inputFullName',
      defaultMessage: 'Full Name'
    },
    inputID: {
      id: 'placeholders.inputID',
      default: 'Please enter your ID'
    }
  },
  header: {
    pending: {
      id: 'header.pending',
      defaultMessage: 'Transaction in Progress'
    },
    success: {
      id: 'header.success',
      defaultMessage: 'Transaction Successful'
    },
    failed: {
      id: 'header.failed',
      defaultMessage: 'Transaction Failed'
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
    },
    verifyingTransaction: {
      id: 'progress.verifyingTransaction',
      defaultMessage: 'Verifying Transaction'
    }
  },
  errors: {
    bankError: {
      id: 'errors.bankError',
      defaultMessage: 'Currency/Bank is not supported, please contact customer support.'
    },
    verificationFailed: {
      id: 'errors.verificationFailed',
      defaultMessage: 'Verification failed. Please check again.'
    },
    networkErrorTitle: {
      id: 'errors.networkErrorTitle',
      defaultMessage: 'Network Error'
    },
    networkError: {
      id: 'errors.networkError',
      defaultMessage: 'Can\'t connect to server, please refresh your browser.'
    }
  }
})
