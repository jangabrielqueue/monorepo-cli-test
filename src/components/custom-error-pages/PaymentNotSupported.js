import React from 'react'
import messages from '../messages'
import { FormattedMessage } from 'react-intl'

const PaymentNotSupported = () => {
  return (
    <>
      <h1>602</h1>
      <p><FormattedMessage {...messages.errors.paymentNotSupported} /></p>
    </>
  )
}

export default PaymentNotSupported
