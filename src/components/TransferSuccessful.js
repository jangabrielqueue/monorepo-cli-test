import React from 'react'
import { FormattedMessage } from 'react-intl'
import messages from './messages'
import { createUseStyles } from 'react-jss'
import { cryptoHelperTexts } from '../utils/utils'
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
      margin: ({ isCrypto }) => `25px 0${isCrypto && ' 12.5px'}`,
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
  },
  cryptoDisplay: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cryptoAmountDisplay: {
    borderTop: '1px solid #e3e3e3',
    margin: '12.5px 0',
    padding: 12.5,
    display: 'flex',
    justifyContent: 'center',
    '&> *': {
      padding: '0 4px'
    },
    '& img': {
      margin: 0,
      padding: 0
    }
  }
})

const TransferSuccessful = ({ transferResult, language }) => {
  const amount = parseFloat(transferResult.amount)
  const isCrypto = transferResult.exchangeAmount != null
  const classes = useStyles({ isCrypto })
  const cryptoHelperText = isCrypto && transferResult.exchangeCurrency in cryptoHelperTexts ? cryptoHelperTexts[transferResult.exchangeCurrency] : { title: '', helperText: '' }
  return (
    <div className={classes.redirectContentSuccess}>
      <img alt='submit-success' src='/icons/submit-success.svg' />
      <h1>{<FormattedMessage {...messages.success.successfullyDeposit} />}</h1>
      <p><span>Reference</span>: {`${transferResult.reference}`}</p>
      {isCrypto && (
        <div className={classes.cryptoDisplay}>
          {transferResult.exchangeCreatedRate && (
            <>
              Exchange Rate: 1 {cryptoHelperText.title} = {new Intl.NumberFormat(language).format(transferResult.exchangeCreatedRate)} {transferResult.currency}
            </>)}
          <div className={classes.cryptoAmountDisplay}>
            <img
              src={require(`../assets/banks/${transferResult.exchangeCurrency?.toUpperCase()}_LOGO.png`)}
              height={20}
              width={20}
              alt={transferResult.exchangeCurrency}
            />
            <span>{cryptoHelperText.helperText}</span>
            <span>{cryptoHelperText.title}</span>
            {new Intl.NumberFormat(language).format(transferResult.exchangeAmount)}
          </div>
        </div>
      )}
      <div className={classes.transactionAmount}>
        <span>
          {transferResult.currency} {amount?.toLocaleString('en-US')}
        </span>
      </div>
    </div>
  )
}

export default TransferSuccessful
