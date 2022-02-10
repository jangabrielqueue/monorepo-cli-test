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
    validatedTransactionFailed: {
      id: 'errors.validatedTransactionFailed',
      defaultMessage: 'Transaction Failed.'
    },
    contactCustomerService: {
      id: 'errors.contactCustomerService',
      defaultMessage: 'Please contact customer service.'
    },
    vcbLoginFailed: {
      id: 'errors.vcbLoginFailed',
      defaultMessage: 'Login Failed!'
    },
    pageDoesNoExist: {
      id: 'errors.pageDoesNoExist',
      defaultMessage: 'Sorry, the page you have visited does not exist.'
    },
    badRequest: {
      id: 'errors.badRequest',
      defaultMessage: 'Bad request, please check your parameters.'
    },
    systemBusy: {
      id: 'errors.systemBusy',
      defaultMessage: 'System is busy, please try again later.'
    },
    sameAccount: {
      id: 'errors.sameAccount',
      defaultMessage: 'Please don\'t submit same amount within one hour.'
    },
    paymentNotSupported: {
      id: 'errors.paymentNotSupported',
      defaultMessage: 'Payment method is not supported.'
    },
    defaultError: {
      id: 'errors.defaultError',
      defaultMessage: 'Oops, something went wrong.'
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
    turnOnLoginOnWeb: {
      id: 'notifications.turnOnLoginOnWeb',
      defaultMessage: 'In order to use VCB, please follow the instructions below step by step'
    },
    turnOnLoginOnWebSteps: {
      id: 'notifications.turnOnLoginOnWebSteps',
      defaultMessage: 'Sign in to <b>Vietcombank App</b>'
    },
    turnOnLoginOnWebSteps1: {
      id: 'notifications.turnOnLoginOnWebSteps1',
      defaultMessage: 'Go to <b>Settings</b> >> <b>General settings</b> >> <b>Login settings</b>'
    },
    turnOnLoginOnWebSteps2: {
      id: 'notifications.turnOnLoginOnWebSteps2',
      defaultMessage: '<red>Turn Off</red> <b>Setting VCB Digibank login on web</b>'
    },
    getVeitcombankOnGooglePlay: {
      id: 'notifications.getVeitcombankOnGooglePlay',
      defaultMessage: 'Get Vietcombank App on Google play'
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
