import React, { useCallback, useContext, useEffect, useState } from 'react'
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
      border: '2px solid #91C431',
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
  }
})

const headerCases = {
  '009': messages.gritHeader.pending,
  '000': messages.gritHeader.success,
  '001': messages.gritHeader.failed,
  '006': messages.gritHeader.confirmed,
  400: messages.gritHeader.error,
  default: messages.gritHeader.establishConnection
}

const PendingBodyDisplay = ({ classes }) => (
  <>
    <section className={classes.contentBody}>
      <p><FormattedMessage {...messages.notes.gritBodyText} /></p>
    </section>
    <section className={classes.depositProgressBarContainer}>
      <div>
        <img alt='submit-verification' src='/icons/submit-verification.png' />
      </div>
    </section>
  </>
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
  const accountInfo = [
    {
      label: <FormattedMessage {...messages.reference} />,
      text: responseData.reference
    },
    {
      label: <FormattedMessage {...messages.receivingAccount} />,
      text: responseData.receiverAccount
    },
    {
      label: <FormattedMessage {...messages.bankName} />,
      text: responseData.receiverBank
    },
    {
      label: <FormattedMessage {...messages.accountHolder} />,
      text: responseData.receiverOwner
    }
  ]
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
        <h1>{new Intl.NumberFormat(language, { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount)}</h1>
      </div>
      <section className={classes.noteSection}>
        <ul>
          <strong><FormattedMessage {...messages.notes.caution} /></strong>
          <li><FormattedMessage {...messages.notes.gritNoteOne} /></li>
          <li><FormattedMessage {...messages.notes.gritNoteTwo} /></li>
          <li><FormattedMessage {...messages.notes.gritNoteThree} /></li>
          <li><FormattedMessage {...messages.notes.gritNoteFour} /></li>
          <li><FormattedMessage {...messages.notes.gritNoteFive} /></li>
          <li><FormattedMessage {...messages.notes.gritNoteSix} /></li>
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
  400: FailedBodyDisplay,
  default: PendingBodyDisplay
}
const queryString = window.location.search
const urlQueryString = new URLSearchParams(queryString)
const queryParams = {
  bank: urlQueryString.get('b'),
  merchant: urlQueryString.get('m'),
  currency: urlQueryString.get('c1'),
  requester: urlQueryString.get('c2'),
  payer: urlQueryString.get('c2'),
  clientIp: urlQueryString.get('c3'),
  callbackUri: urlQueryString.get('c4'),
  amount: urlQueryString.get('a'),
  reference: urlQueryString.get('r'),
  dateTime: urlQueryString.get('d'),
  signature: urlQueryString.get('k'),
  successfulUrl: urlQueryString.get('su'),
  failedUrl: urlQueryString.get('fu'),
  note: urlQueryString.get('n'),
  key: urlQueryString.get('k'),
  customer: urlQueryString.get('c2'),
  datetime: urlQueryString.get('d'),
  language: urlQueryString.get('l'),
  accountId: urlQueryString.get('ai'),
  accountName: urlQueryString.get('an')
}
const GritPay = (props) => {
  const {
    bank,
    merchant,
    currency,
    amount,
    reference,
    successfulUrl,
    failedUrl
  } = queryParams
  const { intl, language } = props
  const analytics = useContext(FirebaseContext)
  const [error, setError] = useState(undefined)
  const [responseData, setResponseData] = useState({ statusCode: undefined })
  const classes = useStyles({ bank })

  const session = `DEPOSIT-GRITPAY-${merchant}-${reference}`.toUpperCase()

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
      ...queryParams
    }

    const connection = new HubConnectionBuilder()
      .withUrl(API_USER_COMMAND_MONITOR)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build()

    connection.on('receivedResult', handleCommandStatusUpdate)
    // connection.onreconnected(async e => {
    //   await connection.invoke('GritpayExternalProviderTransferStart', session, getGritPayPayload)
    // })

    async function start (boolean) {
      try {
        await connection.start()
        boolean && await connection.invoke('GritpayExternalProviderTransferStart', session, getGritPayPayload)
        !boolean && await connection.invoke('Start', session)
      } catch (ex) {
        setError({
          code: intl.formatMessage(messages.errors.networkErrorTitle),
          message: intl.formatMessage(messages.errors.networkError)
        })
      }
    }

    const asyncFunc = async () => {
      const result = await requestStatus({ reference, currency, merchant })
      if (result.error) {
        setError(result.error)
        setResponseData({ ...result, statusCode: result.error.code })
      } if (result.status === '001') {
        setResponseData({ ...result, ...result.data, statusCode: result.status, message: result.description })
      } if (!result) {
        connection.onclose(async () => {
          await start(true)
        })
        start(true)
      } else {
        connection.onclose(async () => {
          await start(false)
        })

        // Start the connection
        start(false)
        setResponseData(result)
      }
    }

    asyncFunc().finally(() => { })
  })
  useEffect(() => {
    window.onbeforeunload = (e) => {
      // this custom message will only appear on earlier version of different browsers.
      // However on modern and latest browsers their own default message will override this custom message.
      // as of the moment only applicable on browsers. there's no definite implementation on mobile
      e.returnValue = 'Do you really want to leave current page?'
    }
  }, [])
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
              <img src='/logo/GW_LOGO.png' alt='logo' />
            </section>
            <section className={classes.contentHeader}>
              <h1><strong><FormattedMessage {...headerCases[responseData.statusCode] || headerCases.default} /></strong></h1>
            </section>

            {bodyDisplayCases[responseData.statusCode] ? bodyDisplayCases[responseData.statusCode](bodyProps) : bodyDisplayCases.default(bodyProps)}
            {responseData.statusCode !== 400 && <FooterDisplay {...bodyProps} />}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default injectIntl(GritPay)
