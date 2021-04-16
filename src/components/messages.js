import { defineMessages } from 'react-intl'

export default defineMessages({
  account: {
    amount: {
      id: 'account.amount',
      defaultMessage: 'Amount'
    },
    accountName: {
      id: 'account.accountName',
      defaultMessage: 'Account Name'
    }
  },
  countdown: {
    id: 'countdown',
    defaultMessage: 'Countdown'
  },
  texts: {
    redirected: {
      id: 'texts.redirected',
      defaultMessage: 'You will be redirected in {timeLeft} seconds..'
    }
  },
  success: {
    successfullyDeposit: {
      id: 'success.successfullyDeposit',
      defaultMessage: 'Successfully Deposited!'
    }
  },
  errors: {
    transactionFailed: {
      id: 'errors.transactionFailed',
      defaultMessage: 'Submitted Transaction Failed!'
    },
    pageDoesNoExist: {
      id: 'errors.pageDoesNoExist',
      defaultMessage: 'Sorry, the page you have visited does not exist.'
    }
  },
  progress: {
    pendingConfirmation: {
      id: 'progress.pendingConfirmation',
      defaultMessage: 'Transaction is pending for confirmation.'
    }
  },
  notifications: {
    hasVCB: {
      id: 'notifications.hasVCB',
      defaultMessage: '- For customers already having VCB Digibank account: <b>Username is phone number registered for this service</b>'
    },
    noVCB: {
      id: 'notifications.noVCB',
      defaultMessage: '- For customers not having VCB Digibank account: <b>Username is VCB-iB@nking username</b>, used to transform to VCB Digibank'
    },
    hasBIDV: {
      id: 'notifications.hasBIDV',
      defaultMessage: 'For customers who have an account SmartBanking: <b>Username is the phone number that is registered for service</b>'
    },
    noBIDV: {
      id: 'notifications.noBIDV',
      defaultMessage: 'For customers who do not have an account SmartBanking: <b>Username is the username of BIDV Online</b>, to convert to the new SmartBanking'
    }
  }
})
