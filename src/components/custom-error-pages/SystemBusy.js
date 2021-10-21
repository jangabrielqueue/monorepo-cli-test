import React from 'react'
import messages from '../messages'
import { FormattedMessage } from 'react-intl'

const SystemBusy = () => {
  return (
    <>
      <h1>600</h1>
      <p><FormattedMessage {...messages.errors.systemBusy} /></p>
    </>
  )
}

export default SystemBusy
