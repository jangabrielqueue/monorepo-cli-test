import React, { useState, useEffect, useCallback, lazy, useContext, Suspense } from 'react'
import messages from './messages'
import { FormattedMessage, injectIntl } from 'react-intl'
import axios from 'axios'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { ErrorBoundary } from 'react-error-boundary'
import { QueryParamsContext } from '../../contexts/QueryParamsContext'
import { FirebaseContext } from '../../contexts/FirebaseContext'
import { createUseStyles } from 'react-jss'
import StepsBar from '../../components/StepsBar'
import ProgressModal from '../../components/ProgressModal'
import LoadingIcon from '../../components/LoadingIcon'
import ErrorAlert from '../../components/ErrorAlert'
import QRCodeForm from './forms/QRCodeForm'
import TransferSuccessful from '../../components/TransferSuccessful'
import TransferFailed from '../../components/TransferFailed'
import AutoRedirect from '../../components/AutoRedirect'
import AutoRedirectQR from '../../components/AutoRedirectQR'
import { QueryParamsValidator } from '../../components/QueryParamsValidator'
import { FallbackComponent } from '../../components/FallbackComponent'
import { checkBankIfKnown, checkIfMomoBank, checkIfTHBCurrency, checkIfTrueWalletBank, checkIfVndCurrency, checkIfZaloBank } from '../../utils/banks'
import { convertToMiliseconds, sleep } from '../../utils/utils'
import VerifyTransaction from '../../components/VerifyTransaction'

// endpoints
const ENDPOINT = process.env.REACT_APP_ENDPOINT
const API_USER_COMMAND_MONITOR = ENDPOINT + '/hubs/monitor'

// lazy loaded components
const Logo = lazy(() => import('../../components/Logo'))

// styling
const useStyles = createUseStyles({
  qrCodeHeader: {
    padding: '10px 20px',
    borderBottom: (props) => props.step === 1 ? '#FFF' : '0.5px solid #E3E3E3'
  },
  qrCodeBody: {
    padding: '20px',
    position: 'relative'
  },
  formWrapper: {
    height: '100%',
    minWidth: '500px',
    padding: '75px 0 0',

    '@media (max-width: 36em)': {
      minWidth: 0,
      overflowY: 'scroll',
      maxHeight: 'calc(100vh - 0px)'
    },

    '@media (max-width: 33.750em)': {
      padding: '35px 20px 0'
    }
  },
  qrCodeTopLogo: {
    margin: '0px auto',
    maxWidth: '280px',

    '& img': {
      height: 'auto',
      width: '100%'
    }
  },
  qrCodeContainer: {
    margin: '0 auto',
    maxWidth: '466px'
  },
  qrCodeContent: {
    background: '#FFFFFF',
    borderRadius: '15px',
    boxShadow: '0 5px 10px 0 rgba(112,112,112,0.3)'
  },
  qrCodeProgressBarContainer: {
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
{ name: 'QRCode' }
)

const QRCode = (props) => {
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
    note,
    methodType,
    exchangeRate,
    exchangeAmount,
    exchangeCurrency
  } = useContext(QueryParamsContext)
  const analytics = useContext(FirebaseContext)
  const [step, setStep] = useState(0)
  const [establishConnection, setEstablishConnection] = useState(false)
  const [loadingButton, setLoadingButton] = useState(false)
  const [error, setError] = useState(undefined)
  const [responseData, setResponseData] = useState({
    customer: null,
    qrCodeContent: null,
    clientTimer: 0,
    amount: 0,
    bank: null
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
  const language = props.language // language was handled at root component not at the queryparams
  const isBankKnown = checkBankIfKnown(currency, responseData.bank)
  const themeColor = isBankKnown ? `${responseData.bank}` : 'main'
  const session = `DEPOSIT-BANK-QRCODE-${merchant}-${reference}`
  const classes = useStyles(step)
  const intl = props.intl
  const THBTimeout = { minutes: 3, seconds: 0 }
  const isTHB = checkIfTHBCurrency(currency)
  const isMomoBank = checkIfMomoBank(bank)
  const isZaloBank = checkIfZaloBank(bank)

  const isCrypto = methodType === 7 || methodType === '7'
  async function handleSubmitQRCode () {
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
      uniqueAmount: responseData.amount
    }
    setTimeout({
      minutes: 0,
      seconds: 0
    })
    setError(undefined)
    setLoadingButton(true)
    setProgress({
      currentStep: 1,
      totalSteps: 5,
      statusMessage: <FormattedMessage {...messages.progress.startingConnection} />
    })
    await sleep(750)
    setProgress({
      currentStep: 2,
      totalSteps: 5,
      statusMessage: <FormattedMessage {...messages.progress.encryptedTransmission} />
    })
    await sleep(750)
    setProgress({
      currentStep: 3,
      totalSteps: 5,
      statusMessage: <FormattedMessage {...messages.progress.beginningTransaction} />
    })
    await sleep(750)
    setProgress({
      currentStep: 4,
      totalSteps: 5,
      statusMessage: <FormattedMessage {...messages.progress.submittingTransaction} />
    })
    await sleep(750)
    setProgress({
      currentStep: 5,
      totalSteps: 5,
      statusMessage: <FormattedMessage {...messages.progress.verifyingTransaction} />
    })

    try {
      await axios({
        url: 'api/depositqrcode/post',
        method: 'POST',
        data: submitValues
      })
    } catch (error) {
      setProgress(undefined)
      setStep(1)
    }

    if (isTHB) {
      await sleep(convertToMiliseconds(THBTimeout))
      setStep(1)
      setProgress(undefined)
      setLoadingButton(false)
    }
  }

  const handleQrCodeResult = useCallback(
    (resultQrCode) => {
      if (resultQrCode.status === '000') {
        const resultQrCodeData = resultQrCode.parseData
        setResponseData(resultQrCodeData)
        setTimeout({
          minutes: resultQrCodeData.clientTimer / 60,
          seconds: 0
        })
      } else {
        setError({
          code: '',
          message: resultQrCode.description
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

  function renderStepContents () {
    const delay = isTHB ? convertToMiliseconds(THBTimeout) : convertToMiliseconds(timeout)
    const firstStepTimeOut = isTHB ? THBTimeout : timeout
    switch (step) {
      case 0:
        return (
          <AutoRedirectQR delay={delay} setStep={setStep} time={firstStepTimeOut} isTHB={isTHB}>
            <QRCodeForm
              currency={currency}
              bank={bank}
              establishConnection={establishConnection}
              loadingButton={loadingButton}
              responseData={responseData}
              color={themeColor}
              handleSubmitQRCode={handleSubmitQRCode}
              error={error}
              language={language}
              reference={reference}
            />
          </AutoRedirectQR>
        )

      case 1:
        if (transferResult.isSuccessful) {
          return (
            <AutoRedirect delay={10000} url={successfulUrl}>
              <TransferSuccessful transferResult={transferResult} language={language} />
            </AutoRedirect>
          )
        } else {
          return (
            <AutoRedirect delay={10000} url={failedUrl}>
              <TransferFailed transferResult={transferResult} language={language} qrCode isTHB={isTHB} />
            </AutoRedirect>
          )
        }
      case 2:
        return (
          <VerifyTransaction language={language} />
        )

      default:
        break
    }
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
        message: <FormattedMessage {...messages.errors.verificationFailed} />
      })
      setStep(1)
    }

    if (!currencies.includes(currency?.toUpperCase())) {
      setTransferResult({
        statusCode: '001',
        isSuccess: false,
        message: <FormattedMessage {...messages.errors.verificationFailed} />
      })
      setStep(1)
    }
  }, [
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
      toAccountId: 0,
      ...isCrypto ? {
        methodType,
        exchangeAmount,
        exchangeCurrency,
        exchangeRate
      } : {}
    }

    const connection = new HubConnectionBuilder()
      .withUrl(API_USER_COMMAND_MONITOR)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
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
          code: intl.formatMessage(messages.errors.networkErrorTitle),
          message: intl.formatMessage(messages.errors.networkError)
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
    successfulUrl,
    intl,
    methodType,
    exchangeAmount,
    exchangeCurrency,
    exchangeRate,
    isCrypto
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
        <QueryParamsValidator />
        <div className={classes.formWrapper}>
          <div className={classes.qrCodeContainer}>
            <div className={classes.qrCodeContent}>
              <section className={classes.qrCodeHeader}>
                <Suspense fallback={<LoadingIcon />}>
                  {
                    !isZaloBank && !isMomoBank && checkIfVndCurrency(currency)
                      ? <div className={classes.qrCodeTopLogo}>
                        <img alt='vietqr' src='/logo/VIETQR.png' width={280} />
                      </div> // eslint-disable-line
                      : checkIfTrueWalletBank(bank) || isZaloBank || isMomoBank
                        ? <Logo bank={bank} currency={currency} />
                        : <Logo bank={responseData.bank} currency={currency} />
                  }
                </Suspense>
                {
                  error && step === 0 &&
                    <ErrorAlert message={`Error ${error.code}: ${error.message}`} />
                }
              </section>
              <section className={classes.qrCodeBody}>
                {
                  renderStepContents()
                }
              </section>
            </div>
            <StepsBar step={step === 1 ? 2 : step} />
          </div>
        </div>
        <ProgressModal open={progress}>
          <div className={classes.qrCodeProgressBarContainer}>
            <img
              alt='submit-transaction'
              width='80'
              height='auto'
              src='/icons/in-progress.svg'
            />
            <progress
              value={
                progress && (progress.currentStep / progress.totalSteps) * 100
              }
              max={100}
            />
            <p>{progress && progress.statusMessage}</p>
          </div>
        </ProgressModal>
      </ErrorBoundary>
    </>
  )
}

export default injectIntl(QRCode)
