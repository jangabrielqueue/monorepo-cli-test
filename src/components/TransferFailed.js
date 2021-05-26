import React from 'react'
import { FormattedMessage } from 'react-intl'
import messages from './messages'
import { createUseStyles } from 'react-jss'

// styling
const useStyles = createUseStyles({
  redirectContentFailed: {
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
  },

  vcbLoginFailed: {
    '& ul': {
      listStyle: 'none',
      padding: 0,
      letterSpacing: 0.4,

      '& li': {
        '&:before': {
          content: "'\\2022'",
          fontWeight: 'bold',
          display: 'inline-block',
          width: '1em',
          fontSize: '1em'
        }
      }
    }
  }
})

const textFormatter = {
  b: msg => (
    <b>
      {msg}
    </b>
  ),
  red: msg => (
    <red>{msg}</red>
  )
}

const VcbLoginFailed = () => {
  return (
    <ul>
      <li>
        <FormattedMessage
          {...messages.notifications.turnOnLoginOnWeb}
          values={textFormatter}
        />
      </li>
      <li>
        <FormattedMessage
          {...messages.notifications.turnOnLoginOnWebSteps}
          values={textFormatter}
        />
      </li>
      <li>
        <FormattedMessage
          {...messages.notifications.turnOnLoginOnWebSteps1}
          values={textFormatter}
        />
      </li>
      <li>
        <FormattedMessage
          {...messages.notifications.turnOnLoginOnWebSteps2}
          values={textFormatter}
        />
      </li>
    </ul>)
}

const TransferFailed = ({ bank, transferResult }) => {
  const classes = useStyles()

  if (bank === 'VCB' && transferResult.message === 'Login failed. Please check again.') {
    return (
      <div className={classes.vcbLoginFailed}>
        <div className={classes.redirectContentFailed}>
          <img alt='submit-failed' src='/icons/submit-failed.svg' />
        </div>
        <VcbLoginFailed />
      </div>
    )
  }

  return (
    <div className={classes.redirectContentFailed}>
      <img alt='submit-failed' src='/icons/submit-failed.svg' />
      <h1>{<FormattedMessage {...messages.errors.transactionFailed} />}</h1>
      <p>{transferResult.message || transferResult.statusMessage}</p>
    </div>
  )
}

export default TransferFailed
