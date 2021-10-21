import React from 'react'
import messages from '../messages'
import { FormattedMessage } from 'react-intl'

const DefaultError = () => {
  return (
    <>
      <h1>&nbsp;</h1>
      <p><FormattedMessage {...messages.errors.defaultError} />..</p>
    </>
  )
}

export default DefaultError
