import React, { useCallback, useContext, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { FormattedMessage, injectIntl } from 'react-intl'
import { createUseStyles } from 'react-jss'
import { FallbackComponent } from '../../components/FallbackComponent'
import { QueryParamsValidator } from '../../components/QueryParamsValidator'
import { FirebaseContext } from '../../contexts/FirebaseContext'
import messages from './messages'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import ErrorAlert from '../../components/ErrorAlert'
import AutoRedirect from '../../components/AutoRedirect'
import { requestStatus } from './Request'
import useOnMountEffect from '../../hooks/useOnMountEffect'
import { theme } from '../../App'
import { QueryParamsContext } from '../../contexts/QueryParamsContext'
import { checkIfRmbCurrency } from '../../utils/banks'

// endpoints
const ENDPOINT = process.env.REACT_APP_ENDPOINT
const API_USER_COMMAND_MONITOR = ENDPOINT + '/hubs/monitor'

const useStyles = createUseStyles({
  '@keyframes spin': {
    from: {
      transform: 'rotate(0)'
    },
    to: {
      transform: 'rotate(360deg)'
    }
  },
  wrapper: {
    position: 'relative',
    height: '100%',
    minWidth: '500px',
    padding: '75px 0 0',

    '@media (max-width: 62em)': {
      padding: (props) => props.bank?.toUpperCase() === 'BIDV' && '0 20px'
    },

    '@media (max-width: 36em)': {
      minWidth: 0
    },

    '@media (max-width: 33.750em)': {
      padding: '35px 20px 0'
    }
  },
  container: {
    margin: '0 auto',
    maxWidth: '466px',
    paddingBottom: '30px'
  },
  content: {
    background: '#FFFFFF',
    borderRadius: '15px',
    padding: '5px',
    boxShadow: '0px 5px 10px 0px rgba(112,112,112,0.3)'
  },
  logoHeader: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px 20px',
    borderBottom: (props) => props.step === 1 ? '#FFF' : '0.5px solid #E3E3E3'
  },
  logoContainer: {
    margin: '25px auto',
    maxWidth: '200px',

    '& img': {
      height: 'auto',
      width: '100%'
    },

    '@media (max-width: 36em) and (orientation: portrait)': {
      margin: '10px auto',
      maxWidth: '150px'
    }
  },
  contentHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    '& h1': {
      fontSize: '20px',
      marginTop: '20px',
      marginBottom: '0',
      textAlign: 'center',
      fontFamily: 'ProductSansRegular',
      color: 'black'
    }

  },
  contentBody: {
    padding: '20px 20px 0',
    position: 'relative',
    '& p': {
      fontSize: '14px',
      textAlign: 'center',
      fontStyle: 'italic'
    },
    '& h1': {
      textAlign: 'center'
    }
  },

  depositProgressBarContainer: {
    color: 'rgba(0, 0, 0, 0.65)',
    textAlign: 'center',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'center',
    '& div': {
      border: `2px solid ${theme.main}`,
      width: '50px',
      height: '50px',
      padding: '10px',
      borderRadius: '50%'
    },
    '& img': {
      animationName: '$spin',
      animationDuration: '1s',
      animationIterationCount: 'infinite',
      width: '25px',
      height: '25px'
    },

    '@media (min-width: 36em)': {
      minWidth: '450px'
    },
    '@media only screen and (min-device-width : 25em) and (max-device-width : 26em)': {
      minWidth: '325px'
    },
    '@media only screen and (min-device-width : 22em) and (max-device-width : 24em)': {
      minWidth: '270px'
    },
    '@media (max-width: 22.438em)': {
      minWidth: '232px'
    }
  },
  accountInfoContainer: {
    fontFamily: 'ProductSansRegular',
    textAlign: 'left',
    margin: '20px 20px 0',
    '& p': {
      margin: 0
    }
  },
  accountInfoText: {
    color: '#3f3f3f',
    borderRadius: '5px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    fontWeight: 'bold'
  },
  contentFailed: {
    textAlign: 'center',

    '& img': {
      margin: '30px 0'
    },

    '& p': {
      color: '#767676',
      fontSize: '16px',
      margin: '25px 0'
    }
  },
  contentSuccess: {
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
    backgroundColor: 'rgba(0, 0, 0, 0.11)',
    borderRadius: '11px',
    color: '#000000',
    fontFamily: 'ProductSansMedium',
    height: '50px',
    margin: '20px',
    textAlign: 'center',
    '& h1': {
      fontSize: '30px',
      lineHeight: '50px'
    }
  },
  errorWrapper: {
    position: 'absolute',
    top: 2,
    left: 0,
    right: 0
  },
  noteSection: {
    fontSize: '14px',
    lineHeight: 1.5,
    margin: '15px 0',
    paddingLeft: '20px',
    '& li': {
      color: '#767676',
      marginBottom: '5px'
    },

    '& ul': {
      boxSizing: 'border-box',
      listStylePosition: 'outside',
      listStyleType: 'circle',

      '& li': {
        color: '#767676',
        marginBottom: '5px'
      }
    }
  },
  verifyTransactionContainer: {
    textAlign: 'center',

    '& img': {
      margin: '30px 0',
      maxWidth: '45px'
    },

    '& h1': {
      color: '#767676',
      fontFamily: 'ProductSansMedium',
      fontSize: '16px',
      lineHeight: 1.5,

      '& span': {
        display: 'block',
        paddingTop: 10
      }
    }
  }
})

const headerCases = {
  '009': messages.gritHeader.pending,
  '000': messages.gritHeader.success,
  '001': messages.gritHeader.failed,
  '006': messages.gritHeader.confirmed,
  '007': messages.gritHeader.verifying,
  400: messages.gritHeader.error,
  default: messages.gritHeader.establishConnection
}

const PendingBodyDisplay = ({ classes, currency }) => (
  <>
    {!checkIfRmbCurrency(currency) &&
      <section className={classes.contentBody}>
        <p><FormattedMessage {...messages.notes.gritBodyText} /></p>
      </section>}
    <section className={classes.depositProgressBarContainer}>
      <div>
        <img alt='submit-verification' src={theme.hourGlass} />
      </div>
    </section>
  </>
)

const VerifyBodyDisplay = ({ classes }) => (
  <div className={classes.verifyTransactionContainer}>
    <img alt='submit-verification' src='/icons/submit-verification.png' />
    {
      <h1>We are verifying the transaction. <br /> Please wait for the status of your transaction. <span>Thank you!</span></h1>
    }
  </div>
)

const FailedBodyDisplay = ({ classes, responseData, failedUrl }) => (
  <AutoRedirect delay={10000} url={failedUrl}>
    <div className={classes.contentFailed}>
      <img alt='submit-failed' src='/icons/submit-failed.svg' />
      <p>{responseData.message}</p>
    </div>
  </AutoRedirect>
)

const SuccessBodyDisplay = ({ classes, responseData, successfulUrl }) => (
  <AutoRedirect delay={10000} url={successfulUrl}>
    <section className={classes.contentSuccess}>
      <img alt='submit-success' src='/icons/submit-success.svg' />
      <p>{responseData.message}</p>

    </section>
  </AutoRedirect>
)

const FooterDisplay = ({ classes, responseData, language, currency, amount }) => {
  const isZhCn = language === 'zh-cn'
  const accountInfo = [
    ...responseData.reference != null ? [{
      label: <FormattedMessage {...messages.reference} />,
      text: responseData.reference
    }] : [],
    ...responseData.receiverAccount != null ? [{
      label: <FormattedMessage {...messages.receivingAccount} />,
      text: responseData.receiverAccount
    }] : [],
    ...responseData.receiverBank != null ? [{
      label: <FormattedMessage {...messages.bankName} />,
      text: responseData.receiverBank
    }] : [],
    ...responseData.receiverOwner != null ? [{
      label: <FormattedMessage {...messages.accountHolder} />,
      text: responseData.receiverOwner
    }] : []
  ]
  const displayAmount = amount != null ? new Intl.NumberFormat(language, { style: 'currency', currency }).format(amount) : '-'
  return (
    <>
      <section className={classes.accountInfoContainer}>
        {
          accountInfo.map((info, idx) => (
            info.text ? (
              <React.Fragment key={idx}>
                <p>{info.label}:</p>
                <p className={classes.accountInfoText}>{info.text}</p>
              </React.Fragment>)
              : <React.Fragment key={idx}></React.Fragment>
          ))
        }
      </section>
      <div className={classes.transactionAmount}>
        <h1>{displayAmount}</h1>
      </div>
      <section className={classes.noteSection}>
        <ul style={{ ...isZhCn ? { listStyleType: 'none' } : {} }}>
          <strong><FormattedMessage {...messages.notes.caution} /></strong>
          <li><FormattedMessage {...messages.notes.gritNoteOne} /></li>
          <li><FormattedMessage {...messages.notes.gritNoteTwo} /></li>
          <li><FormattedMessage {...messages.notes.gritNoteThree} /></li>
          <li><FormattedMessage {...messages.notes.gritNoteFour} /></li>
          {!isZhCn &&
            <>
              <li><FormattedMessage {...messages.notes.gritNoteFive} /></li>
              <li><FormattedMessage {...messages.notes.gritNoteSix} /></li>
            </>}
        </ul>
      </section>
    </>
  )
}

const bodyDisplayCases = {
  '001': FailedBodyDisplay,
  '009': PendingBodyDisplay,
  '000': SuccessBodyDisplay,
  '006': SuccessBodyDisplay,
  '007': VerifyBodyDisplay,
  400: FailedBodyDisplay,
  default: PendingBodyDisplay
}

const GritPay = (props) => {
  const queryParams = useContext(QueryParamsContext)
  const {
    bank,
    merchant,
    currency,
    requester,
    clientIp,
    callbackUri,
    amount,
    reference,
    dateTime,
    signature,
    successfulUrl,
    failedUrl,
    note,
    key,
    customer,
    payer,
    language: queryLanguage,
    toCurrency
  } = queryParams
  const { intl, language } = props
  const analytics = useContext(FirebaseContext)
  const [error, setError] = useState(undefined)
  const [responseData, setResponseData] = useState({ statusCode: undefined })
  const classes = useStyles({ bank })
  const isCrypto = !(toCurrency == null || toCurrency === currency)
  const session = `DEPOSIT-CHANNEL-${merchant}-${reference}`.toUpperCase()

  analytics.setCurrentScreen('gritpay')
  function errorHandler (error, componentStack) {
    analytics.logEvent('exception', {
      stack: componentStack,
      description: error,
      fatal: true
    })
  }

  const bodyProps = {
    classes,
    responseData,
    successfulUrl,
    failedUrl,
    language,
    currency,
    amount
  }

  const handleCommandStatusUpdate = useCallback(
    async (result) => {
      analytics.logEvent('received_result', {
        reference: reference,
        result: result
      })
      if (result.frontEndUri != null) {
        return window.location.replace(result.frontEndUri)
      }
      if (result !== null && result.status == null) {
        setResponseData(result)
        setError(undefined)
      } else if (result.status) {
        setResponseData({ ...result, ...result.data, statusCode: result.status, message: result.description })
      }
    },

    [analytics, reference]
  )

  useOnMountEffect(() => {
    const getGritPayPayload = {
      bank,
      merchant,
      currency,
      requester,
      clientIp,
      callbackUri,
      amount,
      reference,
      dateTime,
      signature,
      successfulUrl,
      failedUrl,
      note,
      key,
      customer,
      payer,
      language: queryLanguage,
      ...isCrypto ? {
        toCurrency
      } : {}
    }

    const connection = new HubConnectionBuilder()
      .withUrl(API_USER_COMMAND_MONITOR)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build()

    connection.on('receivedResult', handleCommandStatusUpdate)

    async function start (boolean) {
      try {
        await connection.start()
        boolean && await connection.invoke('ChannelTransferStart', session, getGritPayPayload)
        !boolean && await connection.invoke('Start', session)
      } catch (ex) {
        setError({
          code: intl.formatMessage(messages.errors.networkErrorTitle),
          message: intl.formatMessage(messages.errors.networkError)
        })
      }
    }

    const asyncFunc = async () => {
      const params = {
        bank,
        merchant,
        currency,
        requester,
        clientIp,
        callbackUri,
        amount,
        reference,
        dateTime,
        signature,
        successfulUrl,
        failedUrl,
        note,
        key,
        customer,
        payer,
        language: queryLanguage,
        ...isCrypto ? {
          toCurrency
        } : {}
      }
      const result = await requestStatus({ ...params })
      if (result.error) {
        setError(result.error)
        setResponseData({ ...result, statusCode: result.error.code })
      } if (result.status === '001') {
        setResponseData({ ...result, ...result.data, statusCode: result.status, message: result.description })
      } if (result.status === '404') {
        connection.onclose(async () => {
          await start(true)
        })
        start(true)
      } else {
        connection.onclose(async () => {
          await start(false)
        })
        start(false)
        setResponseData({ ...result, ...result.data, statusCode: result.status })
      }
    }

    asyncFunc().finally(() => { })
  })
  return (
    <ErrorBoundary onError={errorHandler} FallbackComponent={FallbackComponent}>
      <QueryParamsValidator />
      <div className={classes.wrapper}>
        <div className={classes.errorWrapper}>
          {
            error && <ErrorAlert message={`${error.code}: ${error.message}`} />
          }
        </div>
        <div className={classes.container}>
          <div className={classes.content}>
            <section className={classes.logoHeader}>
              <div className={classes.logoContainer}>
                <img src={theme.logo} alt='logo' />
              </div>
            </section>
            <section className={classes.contentHeader}>
              <h1><strong><FormattedMessage {...headerCases[responseData.statusCode] || headerCases.default} /></strong></h1>
            </section>

            {Object.hasOwn(bodyDisplayCases, responseData.statusCode) ? bodyDisplayCases[responseData.statusCode](bodyProps) : bodyDisplayCases.default(bodyProps)}
            {responseData.statusCode !== 400 && <FooterDisplay {...bodyProps} />}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default injectIntl(GritPay)
