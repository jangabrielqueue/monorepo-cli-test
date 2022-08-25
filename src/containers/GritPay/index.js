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
import CopyToClipboard from 'react-copy-to-clipboard'
import classNames from 'classnames/bind'
import AutoRedirect from '../../components/AutoRedirect'

// endpoints
const ENDPOINT = process.env.REACT_APP_ENDPOINT
const API_USER_COMMAND_MONITOR = ENDPOINT + '/hubs/monitor'

const useStyles = createUseStyles({
  wrapper: {
    position: 'relative',
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
      border: '4px solid #91C431',
      width: '100px',
      padding: '20px',
      borderRadius: '50%'
    },
    '& img': {
      maxWidth: '45px'
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
    margin: '30px 30px 0',
    '& p': {
      margin: 0
    }
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
  toolTipText: {
    backgroundColor: '#555',
    borderRadius: '6px',
    bottom: '125%',
    color: '#fff',
    fontSize: '14px',
    left: '50%',
    marginLeft: '-80px',
    padding: '8px 0',
    position: 'absolute',
    textAlign: 'center',
    visibility: 'hidden',
    width: '140px',
    zIndex: 1,

    '&::after': {
      borderColor: '#555 transparent transparent transparent',
      borderStyle: 'solid',
      borderWidth: '5px',
      content: '""',
      left: '50%',
      marginLeft: '-5px',
      position: 'absolute',
      top: '100%'
    }
  },
  toolTipContainer: {
    cursor: 'pointer',
    display: 'inline-block',
    margin: 0,
    position: 'relative'
  },
  toolTipShow: {
    '-webkit-animation': 'fadeIn 1s',
    animation: 'fadeIn 1s',
    visibility: 'visible'
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

const bodyDisplayCases = {
  '001': FailedBodyDisplay,
  '009': PendingBodyDisplay,
  '000': SuccessBodyDisplay,
  default: PendingBodyDisplay
}

const GritPay = (props) => {
  const {
    bank,
    merchant,
    reference,
    currency,
    amount,
    successfulUrl,
    failedUrl
  } = useContext(QueryParamsContext)
  const { intl, language } = props
  const analytics = useContext(FirebaseContext)
  const [error, setError] = useState(undefined)
  const [isCopy, setIsCopy] = useState(false)
  const [responseData, setResponseData] = useState({ statusCode: undefined })
  const [establishConnection, setEstablishConnection] = useState(false)
  const classes = useStyles({ bank })
  const cx = classNames.bind(classes)
  const toolTipStyles = cx({
    toolTipText: true,
    toolTipShow: isCopy
  })

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
    failedUrl
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
      setEstablishConnection(true)
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

            <section className={classes.referenceContainer}>
              {
                establishConnection
                  ? (
                    <div className={classes.toolTipContainer}>
                      <span className={toolTipStyles}><FormattedMessage {...messages.copiedReference} /></span>

                      <CopyToClipboard text={reference} onCopy={() => setIsCopy(prevState => !prevState)}>
                        <p> <FormattedMessage {...messages.reference} /> {reference}</p>
                      </CopyToClipboard>
                    </div>
                  )
                  : <div className='loading' />
              }
            </section>
            <div className={classes.transactionAmount}>
              <h1>{new Intl.NumberFormat(language, { style: 'currency', currency }).format(amount)}</h1>
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

          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default injectIntl(GritPay)
