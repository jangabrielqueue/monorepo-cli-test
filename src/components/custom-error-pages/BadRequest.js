import React from 'react'
import messages from '../messages'
import { FormattedMessage } from 'react-intl'

const BadRequest = () => {
  return (
    <>
      <h1>400</h1>
      <p><FormattedMessage {...messages.errors.badRequest} /></p>
    </>
  )
}

export default BadRequest
