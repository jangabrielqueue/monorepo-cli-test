import React, { useState, useEffect, useCallback, lazy, useContext, Suspense } from 'react'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { FormattedMessage } from 'react-intl'
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
import OTPBidvForm from './forms/OTPBidvForm'
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
import { sendDepositRequest, sendDepositOtp } from './Requests'
import { sleep, calculateCurrentProgress } from '../../utils/utils'
import { checkBankIfKnown, checkIfDABBank, checkIfMandiriBank } from '../../utils/banks'

// endpoints
const ENDPOINT = process.env.REACT_APP_ENDPOINT
const API_USER_COMMAND_MONITOR = ENDPOINT + '/hubs/monitor'

// lazy loaded components
const Logo = lazy(() => import('../../components/Logo'))

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
  depositContainer: {
    margin: '0 20px',
    maxWidth: '500px',
    width: '100%'
  },
  depositContent: {
    background: '#FFFFFF',
    borderRadius: '15px',
    boxShadow: '0px 5px 10px 0px rgba(112,112,112,0.3)'
  },
  depositFooter: {
    display: 'none',

    '@media (max-width: 36em)': {
      display: 'flex',
      justifyContent: 'space-evenly',
      boxShadow: '0px -5px 10px -3px rgba(112,112,112,0.3)',
      marginTop: '20px',
      padding: '10px 0',
      textAlign: 'center',
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
  const checkBank = {
    isBankKnown: checkBankIfKnown(currency, bank),
    isMandiriBank: checkIfMandiriBank(bank),
    isDabBank: checkIfDABBank(bank)
  }
  const themeColor = checkBank.isBankKnown ? `${bank}` : 'main'
  const { handleSubmit } = useFormContext()
  const [isCardOTP, setIsCardOTP] = useState(false)
  const [isSmartBidv, setIsSmartBidv] = useState(false)
  analytics.setCurrentScreen('deposit')
  const classes = useStyles(step)
  const notificationBanks = ['VCB', 'BIDV']

  async function handleSubmitDeposit (values, e, type) {
    if (type === 'card') { // this is to check if the otp type is card otp
      setIsCardOTP(prevState => !prevState)
    } else if (type === 'smart' && bank?.toUpperCase() === 'BIDV') {
      setIsSmartBidv(prevState => !prevState)
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
        setStep(1)
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
    setWaitingForReady(false)
  }

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

  function renderIcon (type) {
    if (checkBank.isBankKnown && type === 'sms') {
      return `/icons/${bank?.toLowerCase()}/sms-${bank?.toLowerCase()}.png`
    } else if (checkBank.isBankKnown && type === 'smart') {
      return `/icons/${bank?.toLowerCase()}/smart-${bank?.toLowerCase()}.png`
    } else if (!checkBank.isBankKnown && type === 'sms') {
      return '/icons/unknown/sms-unknown.png'
    } else if (!checkBank.isBankKnown && type === 'smart') {
      return '/icons/unknown/smart-unknown.png'
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
    } else if (!checkBank.isMandiriBank && // making sure mandiri bank is not mandiri and undefined to load otp form
      checkBank.isMandiriBank !== undefined && !isSmartBidv && // make sure its not bidv and smart otp
    step === 1) {
      analytics.setCurrentScreen('input_otp')
      return (
        <OTPForm
          otpReference={otpReference}
          handleSubmitOTP={handleSubmitOTP}
          waitingForReady={waitingForReady}
          progress={progress}
          isCardOTP={isCardOTP}
        />
      )
    } else if (!checkBank.isMandiriBank && // making sure mandiri bank is not mandiri and undefined to load otp form
      checkBank.isMandiriBank !== undefined && isSmartBidv && // make sure bidv bank and smart otp
    step === 1) {
      analytics.setCurrentScreen('input_otp')
      return (
        <OTPBidvForm
          otpReference={otpReference}
          waitingForReady={waitingForReady}
          handleSubmitOTP={handleSubmitOTP}
        />
      )
    } else if (checkBank.isMandiriBank && step === 1) {
      analytics.setCurrentScreen('input_otp')
      return (
        <MandiriForm
          otpReference={otpReference}
          handleSubmitOTP={handleSubmitOTP}
          waitingForReady={waitingForReady}
        />
      )
    } else if (step === 2 && isSuccessful) {
      analytics.setCurrentScreen('transfer_successful')
      return (
        <AutoRedirect delay={10000} url={successfulUrl}>
          <TransferSuccessful
            transferResult={transferResult}
            language={language}
          />
        </AutoRedirect>
      )
    } else if (step === 2 && transferResult.statusCode === '000') {
      analytics.setCurrentScreen('transfer_successful')
      return (
        <AutoRedirect delay={10000} url={successfulUrl}>
          <TransferWaitForConfirm transferResult={transferResult} />
        </AutoRedirect>
      )
    } else if (step === 2) {
      analytics.setCurrentScreen('transfer_failed')
      return (
        <AutoRedirect delay={10000} url={failedUrl}>
          <TransferFailed transferResult={transferResult} />
        </AutoRedirect>
      )
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
          code: <FormattedMessage {...messages.errors.networkErrorTitle} />,
          message: <FormattedMessage {...messages.errors.networkError} />
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
    handleUpdateProgress
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

  return (
    <>
      <ErrorBoundary onError={errorHandler} FallbackComponent={FallbackComponent}>
        {
          notificationBanks.includes(bank?.toUpperCase()) &&
            <Notifications bank={bank?.toUpperCase()} language={language} />
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
                step === 1 && !checkBank.isMandiriBank && (
                  <Countdown minutes={0} seconds={100} />
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
        {
          showOtpMethod && step === 0 &&
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
                label={checkBank.isDabBank ? 'CARD OTP' : 'SMART OTP'}
                color={themeColor}
                outlined
                onClick={handleSubmit((values, e) =>
                  handleSubmitDeposit(values, e, checkBank.isDabBank ? 'card' : 'smart')
                )}
                disabled={!establishConnection || waitingForReady}
              >
                <img
                  alt={checkBank.isDabBank ? 'card' : 'smart'}
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

export default Deposit
