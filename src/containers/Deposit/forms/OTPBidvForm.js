import React, { memo, lazy, useContext, useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import QRCode from 'qrcode.react'
import { FormattedMessage, injectIntl } from 'react-intl'
import messages from '../messages'
import { QueryParamsContext } from '../../../contexts/QueryParamsContext'
import { checkBankIfKnown } from '../../../utils/banks'

// lazy loaded components
const GlobalButton = lazy(() => import('../../../components/GlobalButton'))

// styling
const useStyles = createUseStyles({
  headerOne: {
    fontSize: 18,
    textAlign: 'center',
    margin: '0 0 15px',
    color: '#3f3f3f'
  },
  headerTwo: {
    fontSize: 16,
    textAlign: 'center',
    margin: '0 0 15px',

    '& span': {
      color: '#3f3f3f',
      fontFamily: 'ProductSansBold'
    }
  },
  headerThree: {
    fontSize: 14,
    textAlign: 'center',
    margin: '0 0 25px'
  },
  imageContainer: {
    textAlign: 'center'
  },
  submitContainer: {
    margin: '0 auto',
    padding: '25px 0',
    maxWidth: '230px'
  },
  importantNote: {
    color: '#3f3f3f',
    fontFamily: 'ProductSansBold',
    fontSize: '14px',
    margin: '0 0 10px'
  },
  importantList: {
    fontSize: '14px',
    margin: 0,
    padding: '0 0 0 15px'
  }
})

export default injectIntl(memo(function OTPBidvForm (props) {
  const {
    bank,
    currency
  } = useContext(QueryParamsContext)
  const { otpReference, waitingForReady, handleSubmitOTP, intl } = props
  const isBankKnown = checkBankIfKnown(currency, bank)
  const buttonColor = isBankKnown ? `${bank}` : 'main'
  const [timerSeconds, setTimerSeconds] = useState(100)
  const classes = useStyles()

  function handleSubmitForm () {
    // submit 'DONE' as OTP value
    handleSubmitOTP('DONE')
  }

  useEffect(() => {
    const timer = timerSeconds > 0 && setInterval(() => setTimerSeconds(timerSeconds - 1)
      , 1000)

    return () => {
      clearInterval(timer) // clear the timer on unmount
    }
  }, [timerSeconds])

  return (
    <>
      <h1 className={classes.headerOne}><FormattedMessage {...messages.bidvNotifications.transactionWaiting} /></h1>
      <h2 className={classes.headerTwo}>{intl.formatMessage(messages.bidvNotifications.remainingTime, { timerSeconds: <span>{timerSeconds}</span> })}</h2>
      <h3 className={classes.headerThree}><FormattedMessage {...messages.bidvNotifications.dontCloseBrowser} /></h3>
      <div className={classes.imageContainer}>
        {
          otpReference !== undefined &&
            <QRCode value={otpReference} size={200} renderAs='svg' />
        }
      </div>
      <div className={classes.submitContainer}>
        <GlobalButton
          label='Done'
          color={buttonColor}
          onClick={handleSubmitForm}
          disabled={waitingForReady}
        />
      </div>
      <p className={classes.importantNote}>{<FormattedMessage {...messages.important.verificationInstruction} />}</p>
      <ol className={classes.importantList}>
        <li>{<FormattedMessage {...messages.important.openAppNoLogin} />}</li>
        <li>{<FormattedMessage {...messages.important.smartOtp} />}</li>
        <li>{<FormattedMessage {...messages.important.scanQR} />}</li>
      </ol>
    </>
  )
}))
