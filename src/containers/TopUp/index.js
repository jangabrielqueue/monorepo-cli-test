import React, { useState, useEffect, useCallback } from 'react'
import DepositForm from './DepositForm'
import OTPForm from './OTPForm'
import {
  TransferSuccessful,
  TransferFailed
} from '../../components/TransferResult'
import { sendTopUpRequest, sendTopUpOtp } from './Requests'
import * as signalR from '@microsoft/signalr'
import { useQuery, sleep, calculateCurrentProgress } from '../../utils/utils'
import { getBanksByCurrencyForTopUp } from '../../utils/banks'
import { useIntl } from 'react-intl'
import messages from './messages'
import StepsBar from '../../components/StepsBar'
import GlobalButton from '../../components/GlobalButton'
import styled from 'styled-components'
import Statistics from '../../components/Statistics'
import Countdown from '../../components/Countdown'
import ErrorAlert from '../../components/ErrorAlert'
import ProgressModal from '../../components/ProgressModal'
import { useFormContext } from 'react-hook-form'
import * as firebase from 'firebase/app'

const ENDPOINT = process.env.REACT_APP_ENDPOINT
const API_USER_COMMAND_MONITOR = ENDPOINT + '/hubs/monitor'

const WrapperBG = styled.div`
  background-image: linear-gradient(190deg, ${props => props.theme.colors[`${props.color.toLowerCase()}`]} 44%, #FFFFFF calc(44% + 2px));
  padding-top: 75px;
`

function getDefaultBankByCurrency (currency) {
  return getBanksByCurrencyForTopUp(currency)[0]
}

const TopUp = props => {
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
  const merchant = queryParams.get('m')
  const currency = queryParams.get('c1')
  const requester = queryParams.get('c2')
  const clientIp = queryParams.get('c3')
  const amount = queryParams.get('a')
  const reference = queryParams.get('r')
  const datetime = queryParams.get('d')
  const signature = queryParams.get('k')
  const session = `TOPUP-BANK-${merchant}-${reference}`
  const intl = useIntl()
  const themeColor = 'topup'
  const { handleSubmit } = useFormContext()

  analytics.setCurrentScreen('top_up')

  async function handleSubmitDeposit (values, e, type) {
    analytics.logEvent('login', {
      reference
    })
    const otpType = (type === 'sms' || type === undefined) ? '1' : '2'

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
      statusMessage: intl.formatMessage(messages.progress.encryptedTransmission)
    })
    await sleep(750)
    setProgress({
      currentStep: 3,
      totalSteps: 13,
      statusCode: '009',
      statusMessage: intl.formatMessage(messages.progress.beginningTransaction)
    })
    await sleep(750)
    const result = await sendTopUpRequest({
      currency,
      merchant,
      requester,
      bank: getDefaultBankByCurrency(currency).code,
      signature,
      reference,
      clientIp,
      datetime,
      amount,
      otpMethod: otpType,
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
        statusMessage: intl.formatMessage(messages.progress.submittingTransaction)
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
  }

  async function handleSubmitOTP (value) {
    analytics.logEvent('submitted_otp', {
      reference: reference,
      otp: value
    })
    setError(undefined)
    setWaitingForReady(true)
    const result = await sendTopUpOtp(reference, value)
    if (result.errors) {
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
  }

  const handleCommandStatusUpdate = useCallback(
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

  const handleRequestOTP = useCallback(
    async (e) => {
      setProgress(undefined)
      setStep(1)
      setOtpReference(e.extraData)
      setWaitingForReady(false)
    },
    []
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

  function handleWindowResize () {
    setWindowDimensions({
      width: window.outerWidth
    })
  }

  useEffect(() => {
    const queryParamsKeys = ['m', 'c1', 'c2', 'c3', 'a', 'r', 'd', 'k']
    const currencies = ['VND', 'THB']

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

    if (!currencies.includes(queryParams.get('c1') && queryParams.get('c1').toUpperCase())) {
      setTransferResult({
        statusCode: '001',
        isSuccess: false,
        message: intl.formatMessage(messages.errors.verificationFailed)
      })
      setStep(2)
    }

    window.addEventListener('resize', handleWindowResize)

    return () => window.removeEventListener('resize', handleWindowResize)

    // disabling the react hooks recommended rule on this case because it forces to add queryparams and props.history as dependencies array
    // although dep array only needed on first load and would cause multiple rerendering if enforce as dep array. So for this case only will disable it to
    // avoid unnecessary warning
  }, []) // eslint-disable-line

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(API_USER_COMMAND_MONITOR)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build()

    connection.on('receivedResult', handleCommandStatusUpdate)
    connection.on('otpRequested', handleRequestOTP)
    connection.on('update', handleUpdateProgress)
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
  }, [session, handleCommandStatusUpdate, handleRequestOTP, handleUpdateProgress, intl])

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

  let content

  if (step === 0) {
    analytics.setCurrentScreen('input_user_credentials')
    content = (
      <DepositForm
        merchant={merchant}
        requester={requester}
        currency={currency}
        amount={amount}
        reference={reference}
        clientIp={clientIp}
        signature={signature}
        datetime={datetime}
        handleSubmitDeposit={handleSubmitDeposit}
        waitingForReady={waitingForReady}
        windowDimensions={windowDimensions}
        establishConnection={establishConnection}
      />
    )
  } else if (step === 1) {
    analytics.setCurrentScreen('input_otp')
    content = (
      <OTPForm
        otpReference={otpReference}
        handleSubmitOTP={handleSubmitOTP}
        waitingForReady={waitingForReady}
        progress={progress}
      />
    )
  } else if (step === 2 && isSuccessful) {
    analytics.setCurrentScreen('transfer_successful')
    content = (
      <main>
        <TransferSuccessful transferResult={transferResult} language={props.language} />
      </main>
    )
  } else if (step === 2) {
    analytics.setCurrentScreen('transfer_failed')
    content = (
      <main>
        <TransferFailed transferResult={transferResult} />
      </main>
    )
  }

  return (
    <WrapperBG className='wrapper' color={themeColor}>
      <div className='container'>
        <div className='form-content'>
          <header className={step === 2 ? null : 'header-bottom-border'}>
            <section className='logo'>
              <img alt='GameWallet' src={require('../../assets/banks/GW_LOGO.png')} />
            </section>
            {
              step === 0 &&
                <Statistics
                  title={intl.formatMessage(messages.deposit)}
                  language={props.language}
                  currency={currency}
                  amount={amount}
                />
            }
            {
              step === 1 &&
                <Countdown minutes={3} seconds={0} />
            }
            {
              error &&
                <ErrorAlert
                  message={error.message}
                />
            }
          </header>
          {
            content
          }
        </div>
        <StepsBar step={step} />
      </div>
      {
        (windowDimensions.width <= 576 && step === 0) &&
          <footer className='footer-submit-container'>
            <div className='deposit-submit-top-up-buttons'>
              <GlobalButton
                label='SMS OTP'
                color={themeColor}
                outlined
                onClick={handleSubmit((values, e) => handleSubmitDeposit(values, e, 'sms'))}
                disabled={!establishConnection || waitingForReady}
              />
              <GlobalButton
                label='SMART OTP'
                color={themeColor}
                outlined
                onClick={handleSubmit((values, e) => handleSubmitDeposit(values, e, 'smart'))}
                disabled={!establishConnection || waitingForReady}
              />
            </div>
          </footer>
      }
      <ProgressModal open={progress && (progress.statusCode === '009')}>
        <div className='progress-bar-container'>
          <img alt='submit-transaction' width='80' src={require('../../assets/icons/in-progress.svg')} />
          <progress
            value={progress && (progress.currentStep / progress.totalSteps) * 100}
            max={100}
          />
          <p>{progress && progress.statusMessage}</p>
        </div>
      </ProgressModal>
    </WrapperBG>
  )
}

export default TopUp
