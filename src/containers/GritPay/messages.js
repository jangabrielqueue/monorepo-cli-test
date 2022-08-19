import { defineMessages } from 'react-intl'

export default defineMessages({
  gritHeader: {
    pending: {
      id: 'gritHeader.pending',
      defaultMessage: 'TRANSACTION IN PROGRESS'
    },
    success: {
      id: 'gritHeader.success',
      defaultMessage: 'TRANSACTION SUCCESSFUL'
    },
    failed: {
      id: 'gritHeader.failed',
      defaultMessage: 'TRANSACTION FAILED'
    },
    establishConnection: {
      id: 'gritHeader.establishConnection',
      defaultMessage: 'Establishing Connection with GritPay'
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
  },
  reference: {
    id: 'reference',
    defaultMessage: 'Reference'
  }
})
