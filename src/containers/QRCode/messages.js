import { defineMessages } from 'react-intl'

export default defineMessages({
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
