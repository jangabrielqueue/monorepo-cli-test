import React, { useState, useEffect, useCallback, lazy, useContext } from 'react'
import * as firebase from 'firebase/app'
import * as signalR from '@microsoft/signalr'
import { useIntl } from 'react-intl'
import messages from './messages'
import { useFormContext } from 'react-hook-form'
import styled from 'styled-components'
import { QueryParamsContext } from '../../contexts/QueryParamsContext'
// endpoints
const ENDPOINT = process.env.REACT_APP_ENDPOINT
const API_USER_COMMAND_MONITOR = ENDPOINT + '/hubs/monitor'

// lazy loaded components
const Notifications = lazy(() => import('../../components/Notifications'))
const Header = lazy(() => import('../../components/Header'))
const Content = lazy(() => import('./Content'))
const StepsBar = lazy(() => import('../../components/StepsBar'))
const ProgressModal = lazy(() => import('../../components/ProgressModal'))
const GlobalButton = lazy(() => import('../../components/GlobalButton'))

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
const StyledFooter = styled.footer`
  display: none;

  @media (max-width: 36em) {
    display: block;
    box-shadow: 0px -5px 10px -3px rgba(112,112,112,0.3);
    margin-top: 20px;
    padding: 10px 0;
    text-align: center;
    width: 100%;
  }
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

const Deposit = (props) => {
  const analytics = firebase.analytics()
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
  const intl = useIntl()
  const showOtpMethod = currency && currency.toUpperCase() === 'VND'
  const isBankKnown = dynamicLoadBankUtils?.checkBankIfKnown(currency, bank)
  const themeColor = isBankKnown ? `${bank}` : 'main'
  const renderIcon = isBankKnown ? `${bank}` : 'unknown'
  const { handleSubmit } = useFormContext()
  const [isCardOTP, setIsCardOTP] = useState(false)
  analytics.setCurrentScreen('deposit')

  async function handleSubmitDeposit (values, e, type) {
    const { sleep } = await import('../../utils/utils')
    const { sendDepositRequest } = await import('./Requests')

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
  }

  const handleSubmitOTP = useCallback(
    async (value) => {
      const { sendDepositOtp } = await import('./Requests')
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
      const { calculateCurrentProgress } = await import('../../utils/utils')
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

  function handleRequestOTP (e) {
    setProgress(undefined)
    setStep(1)
    setOtpReference(e.extraData)
    setWaitingForReady(false)
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
        message: intl.formatMessage(messages.errors.verificationFailed)
      })
      setStep(2)
    }

    if (!currencies.includes(currency && currency.toUpperCase())) {
      setTransferResult({
        statusCode: '001',
        isSuccess: false,
        message: intl.formatMessage(messages.errors.verificationFailed)
      })
      setStep(2)
    }

    async function dynamicLoadModules () { // dynamically load bank utils
      const { checkBankIfKnown, checkIfDABBank } = await import('../../utils/banks')
      setDynamicLoadBankUtils({
        checkBankIfKnown,
        checkIfDABBank
      })
    }

    dynamicLoadModules()
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
    note
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
    <>
      {
        bank && bank.toUpperCase() === 'VCB' &&
          <Notifications bank={bank} language={language} />
      }
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
            handleSubmitDeposit={handleSubmitDeposit}
            handleSubmitOTP={handleSubmitOTP}
            waitingForReady={waitingForReady}
            establishConnection={establishConnection}
            transferResult={transferResult}
            isCardOTP={isCardOTP}
            otpReference={otpReference}
            progress={progress}
            isSuccessful={isSuccessful}
            language={language}
            analytics={analytics}
          />
        </StyledContent>
        <StepsBar step={step} />
      </StyledContainer>
      {
        showOtpMethod && step === 0 &&
          <StyledFooter>
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
              label={dynamicLoadBankUtils?.checkIfDABBank(bank) ? 'CARD OTP' : 'SMART OTP'}
              color={themeColor}
              outlined
              icon={
                <img
                  alt={dynamicLoadBankUtils?.checkIfDABBank(bank) ? 'card' : 'smart'}
                  width='24'
                  height='24'
                  src={require(`../../assets/icons/${renderIcon.toLowerCase()}/smart-${renderIcon.toLowerCase()}.png`)}
                />
              }
              onClick={handleSubmit((values, e) =>
                handleSubmitDeposit(values, e, dynamicLoadBankUtils?.checkIfDABBank(bank) ? 'card' : 'smart')
              )}
              disabled={!establishConnection || waitingForReady}
            />
          </StyledFooter>
      }
      <ProgressModal open={progress && progress.statusCode === '009'}>
        <StyledProgressBarContainer>
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
        </StyledProgressBarContainer>
      </ProgressModal>
    </>
  )
}

export default Deposit
