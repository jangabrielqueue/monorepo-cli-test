import React from 'react'
import { FormattedMessage } from 'react-intl'
import messages from './messages'
import { createUseStyles } from 'react-jss'

// styling
const useStyles = createUseStyles({
  redirectContentWaitConfirm: {
    textAlign: 'center',

    '& img': {
      margin: '30px 0'
    },

    '& h1': {
      color: '#767676',
      fontFamily: 'ProductSansMedium',
      fontSize: '18px'
    },

    '& h2': {
      color: '#767676',
      fontFamily: 'ProductSansMedium',
      fontSize: '17px',
      margin: '25px 0'
    },

    '& p': {
      color: '#767676',
      fontSize: '16px',
      margin: '25px 0'
    }
  }
})

const TransferWaitForConfirm = ({ transferResult }) => {
  const classes = useStyles()

  return (
    <div className={classes.redirectContentWaitConfirm}>
      <h2>{<FormattedMessage {...messages.progress.pendingConfirmation} />}</h2>
      <p>{transferResult.message || transferResult.statusMessage}</p>
    </div>
  )
}

export default TransferWaitForConfirm
