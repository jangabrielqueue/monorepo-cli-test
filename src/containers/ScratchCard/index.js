import React, { useState, useEffect, useCallback, lazy, useContext } from 'react'
import { sleep } from '../../utils/utils'
import * as signalR from '@microsoft/signalr'
import axios from 'axios'
import { useIntl } from 'react-intl'
import messages from './messages'
import { QueryParamsContext } from '../../contexts/QueryParamsContext'
import { FirebaseContext } from '../../contexts/FirebaseContext'
import { ErrorBoundary } from 'react-error-boundary'
import styled from 'styled-components'

// endpoints
const ENDPOINT = process.env.REACT_APP_ENDPOINT
const API_USER_COMMAND_MONITOR = ENDPOINT + '/hubs/monitor'

// lazy loaded components
const Header = lazy(() => import('./Header'))
const Content = lazy(() => import('./Content'))
const StepsBar = lazy(() => import('../../components/StepsBar'))
const ProgressModal = lazy(() => import('../../components/ProgressModal'))

// styling
const StyledContainer = styled.div`
  margin: 0 20px;
  max-width: 500px;
  width: 100%;
`
const StyledContent = styled.div`
  background: #FFFFFF;
  border-radius: 15px;
  box-shadow: 0px 5px 10px 0px rgba(112,112,112,0.3);
`
const StyledProgressBarContainer = styled.div`
  color: rgba(0, 0, 0, 0.65);
  height: 200px;
  text-align: center;

  > img {
      animation: zoomInAndOut 0.5s ease-in-out;
      margin: 30px 0 2px;
    }

  > progress {
      -webkit-appearance:none;
      border-radius: 7px;
      height: 8px;
      margin-bottom: 2px;
      width: 100%;

      &::-webkit-progress-bar {
          background: #f5f5f5;
          border-radius: 7px;
      }

      &::-webkit-progress-value {
          background: #34A220;
          border-radius: 7px;
          transition: width 0.5s linear;
      }

      &::-moz-progress-bar {
          background: #34A220;
      }
    }

  > p {
      font-family: ProductSansRegular;
      font-size: 14px;
      font-weight: bold;
      margin: 0;
      text-align: center;
    }

  @media (min-width: 36em) {
    min-width: 450px;
  }

  @media only screen and (min-device-width : 25em) and (max-device-width : 26em) {
    min-width: 325px;
  }

  @media only screen and (min-device-width : 22em) and (max-device-width : 24em) {
    min-width: 270px;
  }

  @media (max-width: 22.438em) {
    min-width: 232px;
  }
`

const ScratchCard = (props) => {
  const [dynamicLoadBankUtils, setDynamicLoadBankUtils] = useState(null)
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
  const intl = useIntl()
  const language = props.language // language was handled at root component not at the queryparams
  const session = `DEPOSIT-SCRATCHCARD-${merchant}-${reference}`
  const isBankKnown = dynamicLoadBankUtils?.checkBankIfKnown(currency, bank)
  const themeColor = isBankKnown ? `${bank}` : 'main'
  analytics.setCurrentScreen('scratch_card')

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
        statusMessage: intl.formatMessage(messages.progress.startingConnection)
      })
      await sleep(750)
      setProgress({
        currentStep: 2,
        totalSteps: 5,
        statusCode: '009',
        statusMessage: intl.formatMessage(messages.progress.encryptedTransmission)
      })
      await sleep(750)
      setProgress({
        currentStep: 3,
        totalSteps: 5,
        statusCode: '009',
        statusMessage: intl.formatMessage(messages.progress.beginningTransaction)
      })
      await sleep(750)
      setProgress({
        currentStep: 4,
        totalSteps: 5,
        statusCode: '009',
        statusMessage: intl.formatMessage(messages.progress.submittingTransaction)
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

        if (errors.response.data && errors.response.data.errors) {
          setWaitingForReady(false)
          setProgress(undefined)
          setTransferResult({
            statusCode: '001',
            isSuccess: false,
            message: intl.formatMessage(messages.errors.verificationFailed)
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
      intl,
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
          statusMessage: intl.formatMessage(messages.progress.waitingTransaction)
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
            message: intl.formatMessage(messages.errors.connectionTimeout)
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
    [intl, analytics, reference]
  )

  function errorHandler (error, componentStack) {
    analytics.logEvent('exception', {
      stack: componentStack,
      description: error,
      fatal: true
    })
  }

  function FallbackComponent ({ componentStack, error }) {
    return (
      <div>
        <p>
          <strong>Oops! An error occured!</strong>
        </p>
        <p>Please contact customer service</p>
        <p>
          <strong>Error:</strong> {error.toString()}
        </p>
        <p>
          <strong>Stacktrace:</strong> {componentStack}
        </p>
      </div>
    )
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
        message: intl.formatMessage(messages.errors.verificationFailed)
      })
      setIsSuccessful(false)
      setStep(1)
    }

    if (!currencies.includes(currency?.toUpperCase())) {
      setTransferResult({
        statusCode: '001',
        isSuccess: false,
        message: intl.formatMessage(messages.errors.verificationFailed)
      })
      setIsSuccessful(false)
      setStep(1)
    }

    async function dynamicLoadModules () { // dynamically load bank utils
      const { checkBankIfKnown } = await import('../../utils/banks')
      setDynamicLoadBankUtils({
        checkBankIfKnown
      })
    }

    dynamicLoadModules()
  }, [
    intl,
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
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(API_USER_COMMAND_MONITOR)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
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
            name: intl.formatMessage(messages.errors.networkErrorTitle),
            message: intl.formatMessage(messages.errors.networkError)
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
  }, [session, handleCommandStatusUpdate, intl])

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
        <StyledContainer>
          <StyledContent>
            <Header
              themeColor={themeColor}
              step={step}
              language={language}
              error={error}
            />
            <Content
              step={step}
              handleSubmitScratchCard={handleSubmitScratchCard}
              waitingForReady={waitingForReady}
              establishConnection={establishConnection}
              isSuccessful={isSuccessful}
              transferResult={transferResult}
            />
          </StyledContent>
          <StepsBar step={step === 1 ? 2 : step} />
        </StyledContainer>
        <ProgressModal open={progress && (progress.statusCode === '009')}>
          <StyledProgressBarContainer>
            <img
              alt='submit-transaction'
              width='80'
              height='auto'
              src={require('../../assets/icons/in-progress.svg')}
            />
            <progress
              value={progress && (progress.currentStep / progress.totalSteps) * 100}
              max={100}
            />
            <p>{progress && progress.statusMessage}</p>
          </StyledProgressBarContainer>
        </ProgressModal>
      </ErrorBoundary>
    </>
  )
}

export default ScratchCard
