import { defineMessages } from 'react-intl'

export default defineMessages({
  errors: {
    error: {
      id: 'errors.error',
      defaultMessage: 'Error'
    },
    networkError: {
      id: 'errors.networkError',
      defaultMessage: 'Can\'t connect to server, please refresh your browser.'
    },
    networkErrorTitle: {
      id: 'errors.networkErrorTitle',
      defaultMessage: 'Network Error'
    },
    verificationFailed: {
      id: 'errors.verificationFailed',
      defaultMessage: 'Verification failed. Please check again.'
    }
  },
  notes: {
    noteTitle: {
      id: 'notes.noteTitle',
      defaultMessage: 'Note:'
    },
    expectedRateTitle: {
      id: 'notes.expectedRateTitle',
      defaultMessage: 'Expected rate'
    },
    expectedRate: {
      id: 'notes.expectedRate',
      defaultMessage: 'Note: Expected rate is subject to change without prior notice'
    }
  }
})
