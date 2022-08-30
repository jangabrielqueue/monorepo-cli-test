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
      defaultMessage: 'Establishing Connection'
    },
    confirmed: {
      id: 'gritHeader.confirmed',
      defaultMessage: 'TRANSACTION CONFIRMED'
    },
    error: {
      id: 'gritHeader.error',
      defaultMessage: 'Transaction Expired'
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
  },
  receivingAccount: {
    id: 'receivingAccount',
    defaultMessage: 'Receiving Account'
  },
  copiedReference: {
    id: 'copiedReference',
    defaultMessage: 'reference copied!'
  },
  notes: {
    gritBodyText: {
      id: 'notes.gritBodyText',
      defaultMessage: "You may wait for the confirmation of your transaction or leave this page. Leaving this page won't have any effect on your transaction."
    },
    caution: {
      id: 'notes.caution',
      defaultMessage: 'Caution !'
    },
    gritNoteOne: {
      id: 'notes.gritNoteOne',
      defaultMessage: 'Always submit the deposit form and transfer it to the indicated account within 15 minutes.'
    },
    gritNoteTwo: {
      id: 'notes.gritNoteTwo',
      defaultMessage: 'Be sure to transfer to the indicated account only.'
    },
    gritNoteThree: {
      id: 'notes.gritNoteThree',
      defaultMessage: 'The amount requested and the amount transferred must be the same.'
    },
    gritNoteFour: {
      id: 'notes.gritNoteFour',
      defaultMessage: 'Applicant name and remittance bank name must be the same.'
    },
    gritNoteFive: {
      id: 'notes.gritNoteFive',
      defaultMessage: 'When applying for deposit, transfer to a previous old account other than the new account identified in the system cannot be processed.'
    },
    gritNoteSix: {
      id: 'notes.gritNoteSix',
      defaultMessage: 'We are not responsible for the amount transferred by mistake of the member.'
    }
  }
})
