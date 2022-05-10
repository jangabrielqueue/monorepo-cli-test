import React, { useState, useEffect, useCallback, lazy, useContext, Suspense } from 'react'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { FormattedMessage, injectIntl } from 'react-intl'
import messages from './messages'
import { useFormContext } from 'react-hook-form'
import { QueryParamsContext } from '../../contexts/QueryParamsContext'
import { FirebaseContext } from '../../contexts/FirebaseContext'
import { ErrorBoundary } from 'react-error-boundary'
import { createUseStyles } from 'react-jss'
import GlobalButton from '../../components/GlobalButton'
import Notifications from '../../components/Notifications'
import DepositForm from './forms/DepositForm'
import OTPForm from './forms/OTPForm'
import OTPQrCodeForm from './forms/OTPQrCodeForm'
import MandiriForm from './forms/MandiriForm'
import StepsBar from '../../components/StepsBar'
import TransferSuccessful from '../../components/TransferSuccessful'
import TransferFailed from '../../components/TransferFailed'
import TransferWaitForConfirm from '../../components/TransferWaitForConfirm'
import Statistics from '../../components/Statistics'
import Countdown from '../../components/Countdown'
import ErrorAlert from '../../components/ErrorAlert'
import AutoRedirect from '../../components/AutoRedirect'
import ProgressModal from '../../components/ProgressModal'
import LoadingIcon from '../../components/LoadingIcon'
import { QueryParamsValidator } from '../../components/QueryParamsValidator'
import { FallbackComponent } from '../../components/FallbackComponent'
import { sendDepositRequest, sendDepositOtp } from './Requests'
import { sleep, calculateCurrentProgress, getOtpReference, getOtpMethod } from '../../utils/utils'
import { checkBankIfKnown, checkIfDABBank, checkIfMandiriBank } from '../../utils/banks'

// endpoints
const ENDPOINT = process.env.REACT_APP_ENDPOINT
const API_USER_COMMAND_MONITOR = ENDPOINT + '/hubs/monitor'

// lazy loaded components
const Logo = lazy(() => import('../../components/Logo'))

const notificationBanks = ['VCB', 'BIDV']

// styling
const useStyles = createUseStyles({
  headerContainer: {
    padding: '10px 20px',
    borderBottom: (props) => props.step !== 2 ? '0.5px solid #E3E3E3' : '#FFF'
  },
  contentBody: {
    padding: '20px',
    position: 'relative'
  },
  formWrapper: {
    height: '100%',
    minWidth: '500px',
    padding: (props) => notificationBanks.includes(props.bank?.toUpperCase()) ? '0 20px' : '75px 0 0',

    '@media (max-width: 62em)': {
      padding: (props) => props.bank?.toUpperCase() === 'BIDV' && '0 20px'
    },

    '@media (max-width: 36em)': {
      minWidth: 0,
      overflowY: 'scroll',
      maxHeight: 'calc(100vh - 83px)'
    },

    '@media (max-width: 33.750em)': {
      padding: (props) => notificationBanks.includes(props.bank?.toUpperCase()) ? '0 20px' : '35px 20px 0'
    }
  },
  depositContainer: {
    margin: '0 auto',
    maxWidth: '466px'
  },
  depositContent: {
    background: '#FFFFFF',
    borderRadius: '15px',
    boxShadow: '0px 5px 10px 0px rgba(112,112,112,0.3)'
  },
  depositFooter: {
    display: 'none',

    '@media (max-width: 36em)': {
      backgroundColor: '#FFF',
      bottom: 0,
      boxShadow: '0px -5px 10px -3px rgba(112,112,112,0.3)',
      display: 'flex',
      justifyContent: 'space-evenly',
      left: 0,
      position: 'fixed',
      right: 0,
      width: '100%'
    }
  },
  depositBidvFooter: {
    display: 'none',

    '@media (max-width: 36em)': {
      backgroundColor: '#FFF',
      bottom: 0,
      boxShadow: '0px -5px 10px -3px rgba(112,112,112,0.3)',
      display: 'flex',
      justifyContent: 'center',
      left: 0,
      marginTop: '20px',
      position: 'fixed',
      right: 0,
      width: '100%'
    }
  },
  depositProgressBarContainer: {
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
{ name: 'Deposit' }
)

const Deposit = (props) => {
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
  const [otpReference, setOtpReference] = useState()
  const [waitingForReady, setWaitingForReady] = useState(false)
  const [establishConnection, setEstablishConnection] = useState(false)
  const [error, setError] = useState()
  const [progress, setProgress] = useState(undefined)
  const [isSuccessful, setIsSuccessful] = useState(false)
  const [transferResult, setTransferResult] = useState({})
  const language = props.language // language was handled at root component not at the queryparams
  const session = `DEPOSIT-BANK-${merchant}-${reference}`
  const showOtpMethod = currency && currency.toUpperCase() === 'VND'
  const themeColor = checkBankIfKnown(currency, bank) ? `${bank}` : 'main'
  const { handleSubmit } = useFormContext()
  const [isCardOTP, setIsCardOTP] = useState(false)
  const [otpStatusCode, setOtpStatusCode] = useState('')
  const [reRenderCountdown, setReRenderCountdown] = useState(false)
  analytics.setCurrentScreen('deposit')
  const classes = useStyles({ step, bank })
  const notificationBanks = ['VCB', 'BIDV']
  const intl = props.intl

  async function handleSubmitDeposit (values, e, type) {
    if (type === 'card') { // this is to check if the otp type is card otp
      setIsCardOTP(prevState => !prevState)
    }

    const otpType = type === 'sms' || type === undefined ? '1' : '2'

    analytics.logEvent('login', {
      reference
    })
    setError(undefined)
    setWaitingForReady(true)
    setProgress({
      currentStep: 1,
      totalSteps: 13,
      statusCode: '009',
      statusMessage: <FormattedMessage {...messages.progress.startingConnection} />
    })
    await sleep(750)
    setProgress({
      currentStep: 2,
      totalSteps: 13,
      statusCode: '009',
      statusMessage: <FormattedMessage {...messages.progress.encryptedTransmission} />
    })
    await sleep(750)
    setProgress({
      currentStep: 3,
      totalSteps: 13,
      statusCode: '009',
      statusMessage: <FormattedMessage {...messages.progress.beginningTransaction} />
    })
    await sleep(750)
    const result = await sendDepositRequest({
      currency,
      merchant,
      requester,
      bank,
      signature,
      reference,
      clientIp,
      datetime,
      amount,
      otpMethod: otpType,
      language,
      note,
      successfulUrl,
      failedUrl,
      callbackUri,
      ...values
    })

    if (result.error) {
      analytics.logEvent('login_failed', {
        reference,
        error: result.error
      })
      // until step 4 since it not complete because of error
      setProgress({
        currentStep: 4,
        totalSteps: 13,
        statusCode: '009',
        statusMessage: <FormattedMessage {...messages.progress.submittingTransaction} />
      })
      await sleep(750)
      setProgress(undefined)
      setWaitingForReady(false)
      setError(result.error)
    } else if (result.errors) { // errors means one of the params value were missing or manipulated
      setProgress(undefined)
      setTransferResult({
        statusCode: '001',
        isSuccess: false,
        message: <FormattedMessage {...messages.errors.verificationFailed} />
      })
      setStep(2)
    }
  }

  const handleSubmitOTP = useCallback(
    async (value) => {
      analytics.logEvent('submitted_otp', {
        reference: reference,
        otp: value
      })
      setError(undefined)
      setWaitingForReady(true)
      const result = await sendDepositOtp(reference, value)
      if (result.error) {
        analytics.logEvent('submitted_otp_failed', {
          reference: reference,
          otp: value
        })
        setError(result.error)
        setWaitingForReady(false)
      } else {
        analytics.logEvent('submitted_otp_succeed', {
          reference: reference,
          otp: value
        })
        setProgress({
          currentStep: 3,
          totalSteps: 5,
          statusCode: '009',
          statusMessage: <FormattedMessage {...messages.progress.submittingTransaction} />
        })
        setStep(1)
        setOtpStatusCode('')
      }
    },
    [
      analytics,
      reference
    ]
  )

  const handleReceivedResult = useCallback(
    (e) => {
      analytics.logEvent('received_result', {
        reference: reference,
        result: e
      })
      setIsSuccessful(e.isSuccess)
      setProgress(undefined)
      setTransferResult(e)
      setWaitingForReady(false)
      setStep(2)
    },
    [analytics, reference]
  )

  const handleUpdateProgress = useCallback(
    async (e) => {
      const currentStep = calculateCurrentProgress(e)

      if (e.currentStep !== e.totalSteps) {
        // check if the currentStep is not equal to totalSteps then move the progress bar
        setProgress({
          currentStep: currentStep,
          totalSteps: 13,
          statusCode: e.statusCode,
          statusMessage: <FormattedMessage {...messages.progress.submittingTransaction} />
        })
      } else {
        // else return the final step
        setProgress({
          currentStep: 13,
          totalSteps: 13,
          statusCode: e.statusCode,
          statusMessage: <FormattedMessage {...messages.progress.waitingTransaction} />
        })
      }
    },
    []
  )

  async function handleRequestOTP (e) {
    await sleep(2000) // delaying execution of otp for situation that update and otp method simultaneously invoke.

    setProgress(undefined)
    setStep(1)
    setOtpReference(e.extraData)
    setOtpStatusCode(e.statusCode)
    setWaitingForReady(false)
  }

  function errorHandler (error, componentStack) {
    analytics.logEvent('exception', {
      stack: componentStack,
      description: error,
      fatal: true
    })
  }

  function renderIcon (type) {
    if (checkBankIfKnown(currency, bank) && type === 'sms') {
      return `/icons/${bank?.toLowerCase()}/sms-${bank?.toLowerCase()}.png`
    } else if (checkBankIfKnown(currency, bank) && type === 'smart') {
      return `/icons/${bank?.toLowerCase()}/smart-${bank?.toLowerCase()}.png`
    } else if (!checkBankIfKnown(currency, bank) && type === 'sms') {
      return '/icons/unknown/sms-unknown.png'
    } else if (!checkBankIfKnown(currency, bank) && type === 'smart') {
      return '/icons/unknown/smart-unknown.png'
    }
  }

  function renderOtpForms () {
    const qrCodeOtp = otpReference?.includes('QRCODE_')

    if (checkIfMandiriBank(bank)) {
      return (
        <MandiriForm
          otpReference={otpReference}
          handleSubmitOTP={handleSubmitOTP}
          waitingForReady={waitingForReady}
        />
      )
    } else if (!qrCodeOtp) {
      return (
        <OTPForm
          otpReference={getOtpReference(otpReference)}
          handleSubmitOTP={handleSubmitOTP}
          waitingForReady={waitingForReady}
          progress={progress}
          isCardOTP={isCardOTP}
          methodType={getOtpMethod(otpReference)}
        />
      )
    } else if (qrCodeOtp) {
      return (
        <OTPQrCodeForm
          otpReference={otpReference}
          waitingForReady={waitingForReady}
          handleSubmitOTP={handleSubmitOTP}
        />
      )
    }
  }

  function renderResultPage () {
    if (isSuccessful) {
      analytics.setCurrentScreen('transfer_successful')
      return (
        <AutoRedirect delay={10000} url={successfulUrl}>
          <TransferSuccessful
            transferResult={transferResult}
            language={language}
          />
        </AutoRedirect>
      )
    } else if (transferResult.statusCode === '000') {
      analytics.setCurrentScreen('transfer_successful')
      return (
        <AutoRedirect delay={10000} url={successfulUrl}>
          <TransferWaitForConfirm transferResult={transferResult} />
        </AutoRedirect>
      )
    } else {
      analytics.setCurrentScreen('transfer_failed')
      const delay = bank === 'VCB' ? 30000 : 10000
      return (
        <AutoRedirect delay={delay} url={failedUrl}>
          <TransferFailed bank={bank} transferResult={transferResult} />
        </AutoRedirect>
      )
    }
  }

  function renderStepContents () {
    if (step === 0) {
      analytics.setCurrentScreen('input_user_credentials')
      return (
        <DepositForm
          handleSubmitDeposit={handleSubmitDeposit}
          waitingForReady={waitingForReady}
          establishConnection={establishConnection}
        />
      )
    } else if (step === 1) {
      return renderOtpForms()
    } else if (step === 2) {
      return renderResultPage()
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
      note
    ]
    const currencies = ['VND', 'THB', 'IDR']

    if (queryParams.includes(null)) {
      setTransferResult({
        statusCode: '001',
        isSuccess: false,
        message: <FormattedMessage {...messages.errors.verificationFailed} />
      })
      setStep(2)
    }

    if (!currencies.includes(currency?.toUpperCase())) {
      setTransferResult({
        statusCode: '001',
        isSuccess: false,
        message: <FormattedMessage {...messages.errors.verificationFailed} />
      })
      setStep(2)
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
    note
  ])

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(API_USER_COMMAND_MONITOR)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build()

    connection.on('receivedResult', handleReceivedResult)
    connection.on('otpRequested', handleRequestOTP)
    connection.on('update', handleUpdateProgress)
    connection.onreconnected(async (e) => {
      await connection.invoke('Start', session)
    })

    async function start () {
      try {
        await connection.start()
        await connection.invoke('Start', session)
        setEstablishConnection(true)
      } catch (ex) {
        setError({
          code: intl.formatMessage(messages.errors.networkErrorTitle),
          message: intl.formatMessage(messages.errors.networkError)
        })
        setEstablishConnection(false)
      }
    }

    connection.onclose(async () => {
      await start()
    })

    // Start the connection
    start()
  }, [
    session,
    handleReceivedResult,
    handleUpdateProgress,
    intl
  ])

  useEffect(() => {
    window.onbeforeunload = (e) => {
      if (step < 2) {
        // this custom message will only appear on earlier version of different browsers.
        // However on modern and latest browsers their own default message will override this custom message.
        // as of the moment only applicable on browsers. there's no definite implementation on mobile
        e.returnValue = 'Do you really want to leave current page?'
      }
    }
  }, [step])

  useEffect(() => {
    if (otpStatusCode === '002') {
      // this will help in determing when getting otp and will use this to rerender the countdown time
      // everytime there is a new otp to fill up
      setReRenderCountdown(prevState => !prevState)
    }
  }, [otpStatusCode])

  return (
    <>
      <ErrorBoundary onError={errorHandler} FallbackComponent={FallbackComponent}>
        <QueryParamsValidator />
        <div className={classes.formWrapper}>
          {
            notificationBanks.includes(bank?.toUpperCase()) && <Notifications bank={bank?.toUpperCase()} language={language} />
          }
          <div className={classes.depositContainer}>
            <div className={classes.depositContent}>
              <section className={classes.headerContainer}>
                <Suspense fallback={<LoadingIcon />}>
                  <Logo bank={bank} currency={currency} />
                </Suspense>
                {
                  step === 0 && (
                    <Statistics
                      title={<FormattedMessage {...messages.deposit} />}
                      language={language}
                      currency={currency}
                      amount={amount}
                    />
                  )
                }
                {
                  step === 1 && !checkIfMandiriBank(bank) && bank?.toUpperCase() !== 'BIDV' && (
                    <Countdown minutes={0} seconds={100} reRender={reRenderCountdown} />
                  )
                }
                {
                  error && <ErrorAlert message={error.message} />
                }
              </section>
              <section className={classes.contentBody}>
                {
                  renderStepContents()
                }
              </section>
            </div>
            <StepsBar step={step} />
          </div>
        </div>
        {
          showOtpMethod && step === 0 && bank?.toUpperCase() !== 'BIDV' &&
            <footer className={classes.depositFooter}>
              <GlobalButton
                label='SMS OTP'
                color={themeColor}
                outlined
                onClick={handleSubmit((values, e) =>
                  handleSubmitDeposit(values, e, 'sms')
                )}
                disabled={!establishConnection || waitingForReady}
              >
                <img
                  alt='sms'
                  width='24'
                  height='24'
                  src={renderIcon('sms')}
                />
              </GlobalButton>
              <GlobalButton
                label={checkIfDABBank(bank) ? 'CARD OTP' : 'SMART OTP'}
                color={themeColor}
                outlined
                onClick={handleSubmit((values, e) =>
                  handleSubmitDeposit(values, e, checkIfDABBank(bank) ? 'card' : 'smart')
                )}
                disabled={!establishConnection || waitingForReady}
              >
                <img
                  alt={checkIfDABBank(bank) ? 'card' : 'smart'}
                  width='24'
                  height='24'
                  src={renderIcon('smart')}
                />
              </GlobalButton>
            </footer>
        }
        {
          showOtpMethod && step === 0 && bank?.toUpperCase() === 'BIDV' &&
            <footer className={classes.depositBidvFooter}>
              <GlobalButton
                label='SMART OTP'
                color={themeColor}
                bank='BIDV'
                outlined
                onClick={handleSubmit((values, e) =>
                  handleSubmitDeposit(values, e, 'smart')
                )}
                disabled={!establishConnection || waitingForReady}
              >
                <img
                  alt='smart'
                  width='24'
                  height='24'
                  src={renderIcon('smart')}
                />
              </GlobalButton>
            </footer>
        }
        <ProgressModal open={progress && progress.statusCode === '009'}>
          <div className={classes.depositProgressBarContainer}>
            <img
              alt='submit-transaction'
              width='80'
              height='80'
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

export default injectIntl(Deposit)
