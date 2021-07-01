import React, { useState, useEffect, useCallback, lazy, useContext, Suspense } from 'react'
import { sleep } from '../../utils/utils'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import axios from 'axios'
import { FormattedMessage, useIntl } from 'react-intl'
import messages from './messages'
import { QueryParamsContext } from '../../contexts/QueryParamsContext'
import { FirebaseContext } from '../../contexts/FirebaseContext'
import { ErrorBoundary } from 'react-error-boundary'
import { createUseStyles } from 'react-jss'
import StepsBar from '../../components/StepsBar'
import ProgressModal from '../../components/ProgressModal'
import Statistics from '../../components/Statistics'
import ErrorAlert from '../../components/ErrorAlert'
import LoadingIcon from '../../components/LoadingIcon'
import ScratchCardForm from './forms/ScratchCardForm'
import TransferSuccessful from '../../components/TransferSuccessful'
import TransferFailed from '../../components/TransferFailed'
import TransferWaitForConfirm from '../../components/TransferWaitForConfirm'
import AutoRedirect from '../../components/AutoRedirect'
import { QueryParamsValidator } from '../../components/QueryParamsValidator'
import { FallbackComponent } from '../../components/FallbackComponent'

// endpoints
const ENDPOINT = process.env.REACT_APP_ENDPOINT
const API_USER_COMMAND_MONITOR = ENDPOINT + '/hubs/monitor'

// lazy loaded components
const Logo = lazy(() => import('../../components/Logo'))

// styling
const useStyles = createUseStyles({
  scratchCardHeader: {
    padding: '10px 20px',
    borderBottom: (props) => props.step === 1 ? '#FFF' : '0.5px solid #E3E3E3'
  },
  scratchCardBody: {
    padding: '20px',
    position: 'relative'
  },
  scratchCardContainer: {
    margin: '0 20px',
    maxWidth: '500px',
    width: '100%'
  },
  scratchCardContent: {
    background: '#FFFFFF',
    borderRadius: '15px',
    boxShadow: '0px 5px 10px 0px rgba(112,112,112,0.3)'
  },
  scratchCardProgressBarContainer: {
    color: 'rgba(0, 0, 0, 0.65)',
    height: '200px',
    textAlign: 'center',

    '& img': {
      animation: 'zoomInAndOut 0.5s ease-in-out',
      margin: '30px 0 2px'
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
  }
},
{ name: 'ScratchCard' }
)

const ScratchCard = (props) => {
  const {
    bank,
    merchant,
    currency,
    clientIp,
    callbackUri,
    amount,
    reference,
    successfulUrl,
    failedUrl,
    note,
    key,
    customer,
    dateTime
  } = useContext(QueryParamsContext)
  const analytics = useContext(FirebaseContext)
  const [step, setStep] = useState(0)
  const [waitingForReady, setWaitingForReady] = useState(false)
  const [establishConnection, setEstablishConnection] = useState(false)
  const [error, setError] = useState(undefined)
  const [progress, setProgress] = useState(undefined)
  const [transferResult, setTransferResult] = useState({})
  const [isSuccessful, setIsSuccessful] = useState(undefined)
  const language = props.language // language was handled at root component not at the queryparams
  const session = `DEPOSIT-SCRATCHCARD-${merchant}-${reference}`
  analytics.setCurrentScreen('scratch_card')
  const intl = useIntl()
  const steps = [intl.formatMessage(messages.steps.fillInForm), intl.formatMessage(messages.steps.result)]
  const classes = useStyles(step)

  const handleSubmitScratchCard = useCallback(
    async (values) => {
      analytics.logEvent('login', {
        reference: reference
      })
      const submitValues = {
        Telecom: bank && bank.toUpperCase() === 'GWC' ? 'GW' : values.telcoName,
        Pin: values.cardPin.toString(),
        SerialNumber: values.cardSerialNumber.toString(),
        ClientIp: clientIp,
        Language: language,
        SuccessfulUrl: successfulUrl,
        FailedUrl: failedUrl,
        CallbackUri: callbackUri,
        Datetime: dateTime,
        Key: key,
        Note: note,
        Merchant: merchant,
        Currency: currency,
        Bank: bank,
        Customer: customer,
        Reference: reference,
        Amount: amount
      }

      setWaitingForReady(true)
      setProgress({
        currentStep: 1,
        totalSteps: 5,
        statusCode: '009',
        statusMessage: <FormattedMessage {...messages.progress.startingConnection} />
      })
      await sleep(750)
      setProgress({
        currentStep: 2,
        totalSteps: 5,
        statusCode: '009',
        statusMessage: <FormattedMessage {...messages.progress.encryptedTransmission} />
      })
      await sleep(750)
      setProgress({
        currentStep: 3,
        totalSteps: 5,
        statusCode: '009',
        statusMessage: <FormattedMessage {...messages.progress.beginningTransaction} />
      })
      await sleep(750)
      setProgress({
        currentStep: 4,
        totalSteps: 5,
        statusCode: '009',
        statusMessage: <FormattedMessage {...messages.progress.submittingTransaction} />
      })
      await sleep(750)

      try {
        const response = await axios({
          url: 'api/ScratchCard/Deposit',
          method: 'POST',
          data: submitValues
        })
        if (response.data.statusCode === '009') {
          setProgress(undefined)
          setWaitingForReady(false)
          setIsSuccessful(false)
          setTransferResult(response.data)
          setStep(1)
        } else if (response.data.statusCode === '001') {
          setProgress(undefined)
          setWaitingForReady(false)
          setIsSuccessful(false)
          setTransferResult(response.data)
          setStep(1)
        }
      } catch (errors) {
        analytics.logEvent('login_failed', {
          reference: reference,
          error: errors
        })

        if (errors.response.data?.errors) {
          setWaitingForReady(false)
          setProgress(undefined)
          setTransferResult({
            statusCode: '001',
            isSuccess: false,
            message: <FormattedMessage {...messages.errors.verificationFailed} />
          })
          setIsSuccessful(false)
          setStep(1)
        } else {
          setWaitingForReady(false)
          setProgress(undefined)
          setError(errors)
        }
      }
    }, [
      analytics,
      clientIp,
      language,
      successfulUrl,
      failedUrl,
      callbackUri,
      dateTime,
      key,
      note,
      merchant,
      currency,
      bank,
      customer,
      reference,
      amount
    ])

  const handleCommandStatusUpdate = useCallback(
    async (result) => {
      analytics.logEvent('received_result', {
        reference: reference,
        result: result
      })
      let start, end

      start = performance.now() // eslint-disable-line

      if (result.statusCode === '009') {
        setProgress({
          currentStep: 5,
          totalSteps: 5,
          statusCode: result.statusCode,
          statusMessage: <FormattedMessage {...messages.progress.waitingTransaction} />
        })
        setWaitingForReady(true)
        setStep(0)
        await sleep(180000)
        await new Promise(resolve => resolve(end = performance.now())) // eslint-disable-line
        const time = (end - start)

        if (time >= 180000) {
          setProgress(undefined)
          setWaitingForReady(false)
          setIsSuccessful(false)
          setTransferResult({
            ...result,
            message: <FormattedMessage {...messages.errors.connectionTimeout} />
          })
          setStep(1)
        }
      } else if (result.statusCode === '006') {
        setProgress(undefined)
        setWaitingForReady(false)
        setIsSuccessful(true)
        setTransferResult(result)
        setStep(1)
      } else {
        setProgress(undefined)
        setWaitingForReady(false)
        setIsSuccessful(false)
        setTransferResult(result)
        setStep(1)
      }
    },
    [analytics, reference]
  )

  function errorHandler (error, componentStack) {
    analytics.logEvent('exception', {
      stack: componentStack,
      description: error,
      fatal: true
    })
  }

  function renderStepContents () {
    switch (steps[step]) {
      case intl.formatMessage(messages.steps.fillInForm):
        analytics.setCurrentScreen('input_user_credentials')
        return (
          <ScratchCardForm
            handleSubmitScratchCard={handleSubmitScratchCard}
            waitingForReady={waitingForReady}
            establishConnection={establishConnection}
            bank={bank}
            currency={currency}
            language={language}
          />
        )

      case intl.formatMessage(messages.steps.result):
        if (isSuccessful) {
          analytics.setCurrentScreen('transfer_successful')
          return (
            <AutoRedirect delay={10000} url={successfulUrl}>
              <TransferSuccessful transferResult={transferResult} />
            </AutoRedirect>
          )
        } else if (transferResult.statusCode === '009') {
          analytics.setCurrentScreen('transfer_successful')
          return (
            <AutoRedirect delay={10000} url={successfulUrl}>
              <TransferWaitForConfirm transferResult={transferResult} />
            </AutoRedirect>
          )
        } else {
          analytics.setCurrentScreen('transfer_failed')
          return (
            <AutoRedirect delay={10000} url={failedUrl}>
              <TransferFailed transferResult={transferResult} />
            </AutoRedirect>
          )
        }

      default:
        break
    }
  }

  useEffect(() => {
    const queryParams = [
      bank,
      merchant,
      currency,
      customer,
      clientIp,
      callbackUri,
      amount,
      reference,
      dateTime,
      key,
      successfulUrl,
      failedUrl,
      note,
      language
    ]
    const currencies = ['VND', 'THB']

    if (queryParams.includes(null)) {
      setTransferResult({
        statusCode: '001',
        isSuccess: false,
        message: <FormattedMessage {...messages.errors.verificationFailed} />
      })
      setIsSuccessful(false)
      setStep(1)
    }

    if (!currencies.includes(currency?.toUpperCase())) {
      setTransferResult({
        statusCode: '001',
        isSuccess: false,
        message: <FormattedMessage {...messages.errors.verificationFailed} />
      })
      setIsSuccessful(false)
      setStep(1)
    }
  }, [
    bank,
    merchant,
    currency,
    customer,
    clientIp,
    callbackUri,
    amount,
    reference,
    dateTime,
    key,
    successfulUrl,
    failedUrl,
    note,
    language
  ])

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
        setEstablishConnection(true)
      } catch (ex) {
        setError({
          error: {
            name: <FormattedMessage {...messages.errors.networkErrorTitle} />,
            message: <FormattedMessage {...messages.errors.networkError} />
          }
        })
        setEstablishConnection(false)
      }
    }

    connection.onclose(async () => {
      await start()
    })

    // Start the connection
    start()
  }, [session, handleCommandStatusUpdate])

  useEffect(() => {
    window.onbeforeunload = window.onunload = (e) => {
      if (step === 0) {
        // this custom message will only appear on earlier version of different browsers.
        // However on modern and latest browsers their own default message will override this custom message.
        // as of the moment only applicable on browsers. there's no definite implementation on mobile
        e.returnValue = 'Do you really want to leave current page?'
      }
    }
  }, [step])

  return (
    <>
      <ErrorBoundary onError={errorHandler} FallbackComponent={FallbackComponent}>
        <QueryParamsValidator />
        <div className={classes.scratchCardContainer}>
          <div className={classes.scratchCardContent}>
            <section className={classes.scratchCardHeader}>
              <Suspense fallback={<LoadingIcon />}>
                <Logo bank={bank} currency={currency} type='scratch-card' />
              </Suspense>
              {
                step === 0 && (bank?.toUpperCase() !== 'GWC') && (
                  <Statistics
                    title={<FormattedMessage {...messages.deposit} />}
                    language={language}
                    currency={currency}
                    amount={amount}
                  />
                )
              }
              {
                error && <ErrorAlert message={error.message} />
              }
            </section>
            <section className={classes.scratchCardBody}>
              {
                renderStepContents()
              }
            </section>
          </div>
          <StepsBar step={step === 1 ? 2 : step} />
        </div>
        <ProgressModal open={progress && (progress.statusCode === '009')}>
          <div className={classes.scratchCardProgressBarContainer}>
            <img
              alt='submit-transaction'
              width='80'
              height='80'
              src='/icons/in-progress.svg'
            />
            <progress
              value={progress && (progress.currentStep / progress.totalSteps) * 100}
              max={100}
            />
            <p>{progress && progress.statusMessage}</p>
          </div>
        </ProgressModal>
      </ErrorBoundary>
    </>
  )
}

export default ScratchCard
