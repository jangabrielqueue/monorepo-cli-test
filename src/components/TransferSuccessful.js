import React from 'react'
import { FormattedMessage } from 'react-intl'
import messages from './messages'
import { createUseStyles } from 'react-jss'

// styling
const useStyles = createUseStyles({
  redirectContentSuccess: {
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
      margin: '25px 0',

      '& span': {
        fontWeight: '600'
      }
    }
  },

  transactionAmount: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.11)',
    borderRadius: '11px',
    color: '#000000',
    display: 'flex',
    fontFamily: 'ProductSansMedium',
    fontSize: '18px',
    height: '50px',
    justifyContent: 'center',
    width: '100%'
  }
})

const TransferSuccessful = ({ transferResult, language }) => {
  const classes = useStyles()

  return (
    <div className={classes.redirectContentSuccess}>
      <img alt='submit-success' src='/icons/submit-success.svg' />
      <h1>{<FormattedMessage {...messages.success.successfullyDeposit} />}</h1>
      <p><span>Reference</span>: {`${transferResult.reference}`}</p>
      <div className={classes.transactionAmount}>
        <span>
          {
            new Intl.NumberFormat(language, { style: 'currency', currency: transferResult.currency }).format(transferResult.amount)
          }
        </span>
      </div>
    </div>
  )
}

export default TransferSuccessful
