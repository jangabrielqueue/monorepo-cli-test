import React, { useState, useEffect, useCallback, lazy, useContext } from 'react'
import styled from 'styled-components'
import messages from './messages'
import { useIntl } from 'react-intl'
import axios from 'axios'
import * as signalR from '@microsoft/signalr'
import { ErrorBoundary } from 'react-error-boundary'
import { QueryParamsContext } from '../../contexts/QueryParamsContext'
import { FirebaseContext } from '../../contexts/FirebaseContext'

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

const QRCode = (props) => {
  const [dynamicLoadBankUtils, setDynamicLoadBankUtils] = useState(null)
  const {
    bank,
    merchant,
    currency,
    requester,
    clientIp,
    callbackUri,
    amount,
    reference,
    datetime,
    signature,
    successfulUrl,
    failedUrl,
    note
  } = useContext(QueryParamsContext)
  const analytics = useContext(FirebaseContext)
  const [step, setStep] = useState(0)
  const [establishConnection, setEstablishConnection] = useState(false)
  const [loadingButton, setLoadingButton] = useState(false)
  const [error, setError] = useState(undefined)
  const [responseData, setResponseData] = useState({
    accountName: null,
    decodedImage: null,
    message: null,
    toAccountId: null,
    timer: 0,
    timerExtend: 0
  })
  const [timeout, setTimeout] = useState({
    minutes: 0,
    seconds: 0
  })
  const [progress, setProgress] = useState(undefined)
  const [transferResult, setTransferResult] = useState({
    statusCode: '',
    reference: '',
    statusMessage: '',
    amount: '',
    currency: '',
    isSuccessful: false
  })
  const intl = useIntl()
  const language = props.language // language was handled at root component not at the queryparams
  const isBankKnown = dynamicLoadBankUtils?.checkBankIfKnown(currency, bank)
  const themeColor = isBankKnown ? `${bank}` : 'main'
  const session = `DEPOSIT-BANK-QRCODE-${merchant}-${reference}`

  async function handleSubmitQRCode () {
    const { sleep } = await import('../../utils/utils')
    const submitValues = {
      amount: amount,
      bank: bank,
      callbackUri: callbackUri,
      clientIp: clientIp,
      currency: currency,
      customer: requester,
      datetime: datetime,
      failedUrl: failedUrl,
      key: signature,
      language: language,
      merchant: merchant,
      note: note,
      reference: reference,
      requester: requester,
      signature: signature,
      successfulUrl: successfulUrl,
      toAccountId: responseData.toAccountId,
      uniqueAmount: responseData.amount
    }
    setTimeout({
      minutes: 0,
      seconds: responseData.timerExtend
    })
    setError(undefined)
    setLoadingButton(true)
    setProgress({
      currentStep: 1,
      totalSteps: 5,
      statusMessage: intl.formatMessage(messages.progress.startingConnection)
    })
    await sleep(750)
    setProgress({
      currentStep: 2,
      totalSteps: 5,
      statusMessage: intl.formatMessage(messages.progress.encryptedTransmission)
    })
    await sleep(750)
    setProgress({
      currentStep: 3,
      totalSteps: 5,
      statusMessage: intl.formatMessage(messages.progress.beginningTransaction)
    })
    await sleep(750)
    setProgress({
      currentStep: 4,
      totalSteps: 5,
      statusMessage: intl.formatMessage(messages.progress.submittingTransaction)
    })
    await sleep(750)
    setProgress({
      currentStep: 5,
      totalSteps: 5,
      statusMessage: intl.formatMessage(messages.progress.waitingTransaction)
    })

    try {
      await axios({
        url: 'api/depositqrcode/post',
        method: 'POST',
        data: submitValues
      })
    } catch (error) {
      setTransferResult({
        statusCode: '001',
        statusMessage: error.response.data && error.response.data.error.message,
        isSuccessful: false
      })
      setLoadingButton(false)
      setProgress(undefined)
      setStep(1)
    }
  }

  const handleQrCodeResult = useCallback(
    (resultQrCode) => {
      setResponseData(resultQrCode)
      setTimeout({
        minutes: resultQrCode.timer / 60,
        seconds: 0
      })
      if (resultQrCode.message !== null) {
        setError({
          code: '',
          message: resultQrCode.message
        })
      }
    }, []
  )

  const handleQRCodeSubmitResult = useCallback(
    (resultQrCodeSubmit) => {
      setTransferResult({
        statusCode: resultQrCodeSubmit.statusCode,
        reference: resultQrCodeSubmit.reference,
        statusMessage: resultQrCodeSubmit.statusMessage,
        amount: resultQrCodeSubmit.amount,
        currency: resultQrCodeSubmit.currency,
        isSuccessful: resultQrCodeSubmit.statusCode === '006'
      })
      setLoadingButton(false)
      setProgress(undefined)
      setStep(1)
    }, []
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
      requester,
      clientIp,
      callbackUri,
      amount,
      reference,
      datetime,
      signature,
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
      setStep(1)
    }

    if (!currencies.includes(currency?.toUpperCase())) {
      setTransferResult({
        statusCode: '001',
        isSuccess: false,
        message: intl.formatMessage(messages.errors.verificationFailed)
      })
      setStep(1)
    }
  }, [
    intl,
    bank,
    merchant,
    currency,
    requester,
    clientIp,
    callbackUri,
    amount,
    reference,
    datetime,
    signature,
    successfulUrl,
    failedUrl,
    note,
    language
  ])

  useEffect(() => {
    async function dynamicLoadModules () { // dynamically load bank utils
      const { checkBankIfKnown } = await import('../../utils/banks')
      setDynamicLoadBankUtils({
        checkBankIfKnown
      })
    }

    dynamicLoadModules()
  }, [])

  useEffect(() => {
    const getQRCodePayload = {
      amount: amount,
      bank: bank,
      callbackUri: callbackUri,
      clientIp: clientIp,
      currency: currency,
      customer: requester,
      datetime: datetime,
      failedUrl: failedUrl,
      key: signature,
      language: language,
      merchant: merchant,
      note: note,
      reference: reference,
      requester: requester,
      signature: signature,
      successfulUrl: successfulUrl,
      toAccountId: 0
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(API_USER_COMMAND_MONITOR)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build()

    connection.on('ReceiveQRCode', handleQrCodeResult)
    connection.on('receivedResult', handleQRCodeSubmitResult)
    connection.onreconnected(async (e) => {
      await connection.invoke('QrCodeDPStart', session, getQRCodePayload)
    })

    async function start () {
      try {
        await connection.start()
        await connection.invoke('QrCodeDPStart', session, getQRCodePayload)
        setEstablishConnection(true)
      } catch (error) {
        setError({
          code: '',
          message: intl.formatMessage(messages.errors.bankError)
        })
        setEstablishConnection(true)
      }
    }

    connection.onclose(async () => {
      await start()
    })

    // Start the connection
    start()
  }, [
    session,
    handleQrCodeResult,
    handleQRCodeSubmitResult,
    intl,
    amount,
    bank,
    callbackUri,
    clientIp,
    currency,
    datetime,
    failedUrl,
    language,
    merchant,
    note,
    reference,
    requester,
    signature,
    successfulUrl
  ])

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
              responseData={responseData}
              establishConnection={establishConnection}
            />
            <Content
              loadingButton={loadingButton}
              timeout={timeout}
              transferResult={transferResult}
              handleSubmitQRCode={handleSubmitQRCode}
              language={language}
              responseData={responseData}
              establishConnection={establishConnection}
              themeColor={themeColor}
              error={error}
              step={step}
              setStep={setStep}
            />
          </StyledContent>
          <StepsBar step={step === 1 ? 2 : step} />
        </StyledContainer>
        <ProgressModal open={progress}>
          <StyledProgressBarContainer>
            <img
              alt='submit-transaction'
              width='80'
              height='auto'
              src={require('../../assets/icons/in-progress.svg')}
            />
            <progress
              value={
                progress && (progress.currentStep / progress.totalSteps) * 100
              }
              max={100}
            />
            <p>{progress && progress.statusMessage}</p>
          </StyledProgressBarContainer>
        </ProgressModal>
      </ErrorBoundary>
    </>
  )
}

export default QRCode
