import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react'
import * as firebase from 'firebase/app'
import AutoRedirect from '../../components/AutoRedirect'
import { sendDepositRequest, sendDepositOtp } from './Requests'
import * as signalR from '@microsoft/signalr'
import { useQuery, sleep, calculateCurrentProgress } from '../../utils/utils'
import { useIntl } from 'react-intl'
import messages from './messages'
import Notifications from '../../components/Notifications'
import StepsBar from '../../components/StepsBar'
import { checkBankIfKnown, checkIfDABBank, checkIfMandiriBank } from '../../utils/banks'
import GlobalButton from '../../components/GlobalButton'
import styled from 'styled-components'
import Statistics from '../../components/Statistics'
import Countdown from '../../components/Countdown'
import ErrorAlert from '../../components/ErrorAlert'
import { useFormContext } from 'react-hook-form'
import LoadingIcon from '../../components/LoadingIcon'

// lazy loaded components
const Logo = lazy(() => import('../../components/Logo'))
const DepositForm = lazy(() => import('./DepositForm'))
const OTPForm = lazy(() => import('./OTPForm'))
const MandiriForm = lazy(() => import('./otp-bank-forms/MandiriForm'))
const TransferSuccessful = lazy(() => import('../../components/TransferSuccessful'))
const TransferFailed = lazy(() => import('../../components/TransferFailed'))
const TransferWaitForConfirm = lazy(() => import('../../components/TransferWaitForConfirm'))
const ProgressModal = lazy(() => import('../../components/ProgressModal'))

// endpoints
const ENDPOINT = process.env.REACT_APP_ENDPOINT
const API_USER_COMMAND_MONITOR = ENDPOINT + '/hubs/monitor'

// styled components
const WrapperBG = styled.div`
  background-image: linear-gradient(
    190deg,
    ${(props) => props.theme.colors[`${props.color.toLowerCase()}`]} 44%,
    #ffffff calc(44% + 2px)
  );
  padding-top: ${props => props.bank && props.bank.toUpperCase() === 'VCB' ? '105px' : '75px'};

  @media (max-width: 33.750em) {
    padding-top: ${props => props.bank && props.bank.toUpperCase() !== 'VCB' && '35px'};
  }
`

const Deposit = (props) => {
  const analytics = firebase.analytics()
  const [step, setStep] = useState(0)
  const [otpReference, setOtpReference] = useState()
  const [waitingForReady, setWaitingForReady] = useState(false)
  const [establishConnection, setEstablishConnection] = useState(false)
  const [error, setError] = useState()
  const [progress, setProgress] = useState(undefined)
  const [isSuccessful, setIsSuccessful] = useState(false)
  const [transferResult, setTransferResult] = useState({})
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.outerWidth
  })
  const queryParams = useQuery()
  const bank = queryParams.get('b')
  const merchant = queryParams.get('m')
  const currency = queryParams.get('c1')
  const requester = queryParams.get('c2')
  const clientIp = queryParams.get('c3')
  const callbackUri = queryParams.get('c4')
  const amount = queryParams.get('a')
  const reference = queryParams.get('r')
  const datetime = queryParams.get('d')
  const signature = queryParams.get('k')
  const successfulUrl = queryParams.get('su')
  const failedUrl = queryParams.get('fu')
  const note = queryParams.get('n')
  const language = props.language // language was handled at root component not at the queryparams
  const session = `DEPOSIT-BANK-${merchant}-${reference}`
  const intl = useIntl()
  const showOtpMethod = currency && currency.toUpperCase() === 'VND'
  analytics.setCurrentScreen('deposit')
  const isBankKnown = checkBankIfKnown(currency, bank)
  const themeColor = isBankKnown ? `${bank}` : 'main'
  const renderIcon = isBankKnown ? `${bank}` : 'unknown'
  const { handleSubmit } = useFormContext()
  const [isCardOTP, setIsCardOTP] = useState(false)

  const handleSubmitDeposit = useCallback(
    async (values, e, type) => {
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
        statusMessage: intl.formatMessage(messages.progress.startingConnection)
      })
      await sleep(750)
      setProgress({
        currentStep: 2,
        totalSteps: 13,
        statusCode: '009',
        statusMessage: intl.formatMessage(
          messages.progress.encryptedTransmission
        )
      })
      await sleep(750)
      setProgress({
        currentStep: 3,
        totalSteps: 13,
        statusCode: '009',
        statusMessage: intl.formatMessage(messages.progress.beginningTransaction)
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
          statusMessage: intl.formatMessage(
            messages.progress.submittingTransaction
          )
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
          message: intl.formatMessage(messages.errors.verificationFailed)
        })
        setStep(2)
      }
    }, [
      amount,
      analytics,
      bank,
      callbackUri,
      clientIp,
      currency,
      datetime,
      failedUrl,
      intl,
      language,
      merchant,
      note,
      reference,
      requester,
      signature,
      successfulUrl
    ]
  )

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
    (e) => {
      const currentStep = calculateCurrentProgress(e)

      if (e.currentStep !== e.totalSteps) {
        // check if the currentStep is not equal to totalSteps then move the progress bar
        setProgress({
          currentStep: currentStep,
          totalSteps: 13,
          statusCode: e.statusCode,
          statusMessage: intl.formatMessage(messages.progress.submittingTransaction)
        })
      } else {
        // else return the final step
        setProgress({
          currentStep: 13,
          totalSteps: 13,
          statusCode: e.statusCode,
          statusMessage: intl.formatMessage(messages.progress.waitingTransaction)
        })
      }
    },
    [intl]
  )

  const renderStepContents = useMemo(() => () => {
    if (step === 0) {
      analytics.setCurrentScreen('input_user_credentials')
      return (
        <DepositForm
          currency={currency}
          bank={bank}
          handleSubmitDeposit={handleSubmitDeposit}
          waitingForReady={waitingForReady}
          showOtpMethod={showOtpMethod}
          windowDimensions={windowDimensions}
          establishConnection={establishConnection}
          reference={reference}
        />
      )
    } else if (checkIfMandiriBank(bank) && step === 1) {
      analytics.setCurrentScreen('input_otp')
      return (
        <MandiriForm
          otpReference={otpReference}
          handleSubmitOTP={handleSubmitOTP}
          waitingForReady={waitingForReady}
          bank={bank}
        />
      )
    } else if (step === 1) {
      analytics.setCurrentScreen('input_otp')
      return (
        <OTPForm
          otpReference={otpReference}
          handleSubmitOTP={handleSubmitOTP}
          waitingForReady={waitingForReady}
          bank={bank}
          currency={currency}
          progress={progress}
          isCardOTP={isCardOTP}
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
  }, [
    analytics,
    bank,
    currency,
    establishConnection,
    failedUrl,
    handleSubmitDeposit,
    handleSubmitOTP,
    isCardOTP,
    isSuccessful,
    language,
    otpReference,
    progress,
    reference,
    showOtpMethod,
    step,
    successfulUrl,
    transferResult,
    waitingForReady,
    windowDimensions
  ])

  function handleRequestOTP (e) {
    setProgress(undefined)
    setStep(1)
    setOtpReference(e.extraData)
    setWaitingForReady(false)
  }

  function handleWindowResize () {
    setWindowDimensions({
      width: window.outerWidth
    })
  }

  useEffect(() => {
    const queryParamsKeys = [
      'b',
      'm',
      'c1',
      'c2',
      'c3',
      'c4',
      'a',
      'r',
      'd',
      'k',
      'su',
      'fu',
      'n',
      'l'
    ]
    const currencies = ['VND', 'THB', 'IDR']

    for (const param of queryParamsKeys) {
      if (!queryParams.has(param)) {
        setTransferResult({
          statusCode: '001',
          isSuccess: false,
          message: intl.formatMessage(messages.errors.verificationFailed)
        })
        setStep(2)
      }
    }

    if (
      !currencies.includes(
        queryParams.get('c1') && queryParams.get('c1').toUpperCase()
      )
    ) {
      setTransferResult({
        statusCode: '001',
        isSuccess: false,
        message: intl.formatMessage(messages.errors.verificationFailed)
      })
      setStep(2)
    }

    window.addEventListener('resize', handleWindowResize)

    return () => window.removeEventListener('resize', handleWindowResize)
  }, [
    intl,
    queryParams
  ])

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(API_USER_COMMAND_MONITOR)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
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

  return (
    <WrapperBG className='wrapper' bank={bank} color={themeColor}>
      <Notifications bank={bank} language={language} />
      <div className='container'>
        <div className='form-content'>
          <header className={step === 2 ? null : 'header-bottom-border'}>
            <Suspense fallback={<LoadingIcon size='large' color={themeColor} />}>
              <Logo bank={bank} currency={currency} />
            </Suspense>
            {
              step === 0 && (
                <Statistics
                  title={intl.formatMessage(messages.deposit)}
                  language={language}
                  currency={currency}
                  amount={amount}
                />
              )
            }
            {
              step === 1 && !checkIfMandiriBank(bank) && (
                <Countdown minutes={3} seconds={0} />
              )
            }
            {
              error && <ErrorAlert message={error.message} />
            }
          </header>
          <Suspense fallback={<LoadingIcon size='large' color={themeColor} />}>
            {renderStepContents()}
          </Suspense>
        </div>
        <StepsBar step={step} />
      </div>
      {
        showOtpMethod && windowDimensions.width <= 576 && step === 0 && (
          <footer className='footer-submit-container'>
            <div className='deposit-submit-buttons'>
              <GlobalButton
                label='SMS OTP'
                color={themeColor}
                outlined
                icon={
                  <img
                    alt='sms'
                    width='24'
                    height='24'
                    src={require(`../../assets/icons/${renderIcon.toLowerCase()}/sms-${renderIcon.toLowerCase()}.png`)}
                  />
                }
                onClick={handleSubmit((values, e) =>
                  handleSubmitDeposit(values, e, 'sms')
                )}
                disabled={!establishConnection || waitingForReady}
              />
              <GlobalButton
                label={checkIfDABBank(bank) ? 'CARD OTP' : 'SMART OTP'}
                color={themeColor}
                outlined
                icon={
                  <img
                    alt={checkIfDABBank(bank) ? 'card' : 'smart'}
                    width='24'
                    height='24'
                    src={require(`../../assets/icons/${renderIcon.toLowerCase()}/smart-${renderIcon.toLowerCase()}.png`)}
                  />
                }
                onClick={handleSubmit((values, e) =>
                  handleSubmitDeposit(values, e, checkIfDABBank(bank) ? 'card' : 'smart')
                )}
                disabled={!establishConnection || waitingForReady}
              />
            </div>
          </footer>
        )
      }
      <Suspense fallback={null}>
        <ProgressModal open={progress && progress.statusCode === '009'}>
          <div className='progress-bar-container'>
            <img
              alt='submit-transaction'
              width='80'
              height='80'
              src={require('../../assets/icons/in-progress.svg')}
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
      </Suspense>
    </WrapperBG>
  )
}

export default Deposit
