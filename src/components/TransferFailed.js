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
      fontSize: '18px',
      lineHeight: 1.5
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
          width: '0.8em',
          fontSize: '1em'
        }
      }
    }
  },

  vcbGetMobileApp: {
    borderTop: '0.5px solid rgb(227, 227, 227)',
    textAlign: 'center',

    '& p': {
      color: '#767676',
      fontSize: '16px',
      margin: '20px 0'
    }
  },

  separator: {
    borderTop: '0.5px solid rgb(227, 227, 227)',
    padding: '20px 0'
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

const VcbLoginInstructions = () => {
  const classes = useStyles()
  return (
    <ul>
      <li className={classes.separator}>
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
      <li className={classes.separator}>
        <FormattedMessage
          {...messages.notifications.hasVCB}
          values={textFormatter}
        />
      </li>
      <li>
        <FormattedMessage
          {...messages.notifications.noVCB}
          values={textFormatter}
        />
      </li>
    </ul>)
}

const VcbDownloadApp = () => {
  return (
    <a href='https://play.google.com/store/apps/details?id=com.VCB&hl=en&gl=US'>
      <img width='300' alt='submit-failed' src='/images/google-play-badge.png' />
    </a>
  )
}

const TransferFailed = ({ bank, transferResult, qrCode }) => {
  const classes = useStyles()

  if (bank === 'VCB' && transferResult.message === 'Login failed. Please check again.') {
    return (
      <div>
        <div className={classes.redirectContentFailed}>
          <img alt='submit-failed' src='/icons/submit-failed.svg' />
          <h1>{<FormattedMessage {...messages.errors.vcbLoginFailed} />}</h1>
        </div>
        <div className={classes.vcbLoginFailed}>
          <VcbLoginInstructions />
        </div>
        <div className={classes.vcbGetMobileApp}>
          <p>{<FormattedMessage {...messages.notifications.getVeitcombankOnGooglePlay} />}</p>
          <VcbDownloadApp />
        </div>
      </div>
    )
  }

  return (
    <div className={classes.redirectContentFailed}>
      <img alt='submit-failed' src='/icons/submit-failed.svg' />
      {
        qrCode && <h1><FormattedMessage {...messages.errors.validatedTransactionFailed} /> <br /> <FormattedMessage {...messages.errors.contactCustomerService} /></h1>
      }
      {
        !qrCode && <h1><FormattedMessage {...messages.errors.transactionFailed} /></h1>
      }
      <p>{transferResult.message || transferResult.statusMessage}</p>
    </div>
  )
}

export default TransferFailed
