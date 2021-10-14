import React from 'react'
import messages from '../messages'
import { FormattedMessage } from 'react-intl'

const SameAccount = () => {
  return (
    <>
      <h1>601</h1>
      <p><FormattedMessage {...messages.errors.sameAccount} /></p>
    </>
  )
}

export default SameAccount
