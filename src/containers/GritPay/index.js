import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { FormattedMessage, injectIntl } from 'react-intl'
import { createUseStyles } from 'react-jss'
import { FallbackComponent } from '../../components/FallbackComponent'
import { QueryParamsValidator } from '../../components/QueryParamsValidator'
import { FirebaseContext } from '../../contexts/FirebaseContext'
import { QueryParamsContext } from '../../contexts/QueryParamsContext'
import messages from './messages'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import ErrorAlert from '../../components/ErrorAlert'

// endpoints
const ENDPOINT = process.env.REACT_APP_ENDPOINT
const API_USER_COMMAND_MONITOR = ENDPOINT + '/hubs/monitor'

const useStyles = createUseStyles({
  formWrapper: {
    height: '100%',
    minWidth: '500px',
    padding: '75px 0 0',

    '@media (max-width: 62em)': {
      padding: (props) => props.bank?.toUpperCase() === 'BIDV' && '0 20px'
    },

    '@media (max-width: 36em)': {
      minWidth: 0,
      overflowY: 'scroll',
      maxHeight: 'calc(100vh - 83px)'
    },

    '@media (max-width: 33.750em)': {
      padding: '35px 20px 0'
    }
  },
  container: {
    margin: '0 auto',
    maxWidth: '466px'
  },
  content: {
    background: '#FFFFFF',
    borderRadius: '15px',
    boxShadow: '0px 5px 10px 0px rgba(112,112,112,0.3)'
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    borderBottom: (props) => props.step !== 2 ? '0.5px solid #E3E3E3' : '#FFF',
    '& p': {
      fontSize: '20px',
      margin: 'auto',
      textAlign: 'center',
      fontFamily: 'ProductSansRegular'
    }

  },
  contentBody: {
    padding: '20px 40px 5px',
    position: 'relative',
    '& p': {
      fontSize: '14px',
      textAlign: 'center',
      fontStyle: 'italic'
    }
  },

  depositProgressBarContainer: {
    color: 'rgba(0, 0, 0, 0.65)',
    textAlign: 'center',
    padding: '20px',

    '& img': {
      margin: '10px',
      maxWidth: '45px'
    },

    '& progress': {
      '-webkit-appearance': 'none',
      borderRadius: '7px',
      height: '8px',
      marginBottom: '2px',
      width: '100%',

      '&::-webkit-progress-bar': {
        background: '#f5f5f5',
        borderRadius: '7px'
      },

      '&::-webkit-progress-value': {
        background: '#34A220',
        borderRadius: '7px',
        transition: 'width 0.5s linear'
      }
    },

    '& p': {
      fontFamily: 'ProductSansRegular',
      fontSize: '14px',
      fontWeight: 'bold',
      margin: 0,
      textAlign: 'center'
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
  referenceContainer: {
    fontFamily: 'ProductSansRegular',
    fontSize: '14px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px'
  }
})

const headerCases = {
  '009': messages.header.pending,
  '006': messages.header.success,
  default: messages.header.failed
}

const PendingBodyDisplay = ({ classes, reference }) => (
  <>

    <section className={classes.depositProgressBarContainer}>
      <img alt='submit-verification' src='/icons/submit-verification.png' />
    </section>

    <section className={classes.contentBody}>
      <p>You may wait for the confirmation of your transaction or leave this page. Leaving this page won't have any effect on your transaction.</p>
    </section>
    <section className={classes.referenceContainer}>
      <p>transaction reference: {reference}</p>
    </section>
  </>
)

const FailedBodyDisplay = ({ classes, reference }) => (
  <>
    <section className={classes.contentBody}>
      Failed Transaction
      <p>transaction reference: {reference}</p>
    </section>
  </>
)

const SuccessBodyDisplay = ({ classes, reference }) => (
  <section className={classes.contentBody}>
    Success Transaction
    <p>transaction reference: {reference}</p>
  </section>
)

const bodyDisplayCases = {
  '009': PendingBodyDisplay,
  '006': SuccessBodyDisplay,
  default: FailedBodyDisplay
}
const GritPay = (props) => {
  const {
    bank,
    merchant,
    reference
    // currency
    // requester,
    // clientIp,
    // callbackUri,
    // amount,
    // datetime,
    // signature,
    // successfulUrl,
    // failedUrl,
    // note
  } = useContext(QueryParamsContext)
  const intl = props.intl
  const analytics = useContext(FirebaseContext)
  const [error, setError] = useState(undefined)
  const [responseData, setResponseData] = useState({ statusCode: '009' })

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
    reference, classes
  }

  const handleCommandStatusUpdate = useCallback(
    async (result) => {
      analytics.logEvent('received_result', {
        reference: reference,
        result: result
      })
      setResponseData(result)
    },

    [analytics, reference]
  )
  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(API_USER_COMMAND_MONITOR)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build()

    connection.on('receivedResult', handleCommandStatusUpdate)
    connection.onreconnected(async e => {
      await connection.invoke('Start', session)
    })

    async function start () {
      try {
        await connection.start()
        await connection.invoke('Start', session)
      } catch (ex) {
        setError({
          code: intl.formatMessage(messages.errors.networkErrorTitle),
          message: intl.formatMessage(messages.errors.networkError)
        })
      }
    }

    connection.onclose(async () => {
      await start()
    })

    // Start the connection
    start()
  }, [session, handleCommandStatusUpdate, intl])

  return (
    <ErrorBoundary onError={errorHandler} FallbackComponent={FallbackComponent}>
      <QueryParamsValidator />
      <div className={classes.formWrapper}>
        <div className={classes.container}>
          <div className={classes.content}>
            <section className={classes.headerContainer}>
              <p><strong><FormattedMessage {...headerCases[responseData.statusCode] || headerCases.default} /></strong></p>
              {
                error && <ErrorAlert message={`Error ${error.code}: ${error.message}`} />
              }
            </section>
            {bodyDisplayCases[responseData.statusCode] ? bodyDisplayCases[responseData.statusCode](bodyProps) : bodyDisplayCases.default}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default injectIntl(GritPay)
