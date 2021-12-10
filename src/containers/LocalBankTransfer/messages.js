import { defineMessages } from 'react-intl'

export default defineMessages({
  localBanktransfer: {
    kindleAssureToDepositExactAmount: {
      id: 'localBanktransfer.kindleAssureToDepositExactAmount',
      defaultMessage: 'Kindly assure to deposit the exact amount stated below for a smooth procedure.'
    },
    bankName: {
      id: 'localBanktransfer.bankName',
      defaultMessage: 'Bank Name'
    },
    accountName: {
      id: 'localBanktransfer.accountName',
      defaultMessage: 'Account Name'
    },
    accountNumber: {
      id: 'localBanktransfer.accountNumber',
      defaultMessage: 'Account No.'
    },
    amount: {
      id: 'localBanktransfer.amount',
      defaultMessage: 'Amount'
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
  errors: {
    networkError: {
      id: 'errors.networkError',
      defaultMessage: 'Can\'t connect to server, please refresh your browser.'
    },
    networkErrorTitle: {
      id: 'errors.networkErrorTitle',
      defaultMessage: 'Network Error'
    },
    bankError: {
      id: 'errors.bankError',
      defaultMessage: 'Currency/Bank is not supported, please contact customer support.'
    },
    verificationFailed: {
      id: 'errors.verificationFailed',
      defaultMessage: 'Verification failed. Please check again.'
    }
  }
})
