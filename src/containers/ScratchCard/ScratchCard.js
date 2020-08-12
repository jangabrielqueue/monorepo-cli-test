import React, { useState, useEffect, useCallback } from 'react'
import ScratchCardForm from './ScratchCardForm'
import { useQuery, sleep } from '../../utils/utils'
import * as signalR from '@microsoft/signalr'
import axios from 'axios'
import AutoRedirect from '../../components/AutoRedirect'
import {
  TransferSuccessful,
  TransferFailed,
  TransferWaitForConfirm
} from '../../components/TransferResult'
import { useIntl } from 'react-intl'
import messages from './messages'
import Logo from '../../components/Logo'
import StepsBar from '../../components/StepsBar'
import { checkBankIfKnown } from '../../utils/banks'
import Statistics from '../../components/Statistics'
import styled from 'styled-components'
import ErrorAlert from '../../components/ErrorAlert'
import ProgressModal from '../../components/ProgressModal'
import * as firebase from 'firebase/app'

const ENDPOINT = process.env.REACT_APP_ENDPOINT
const API_USER_COMMAND_MONITOR = ENDPOINT + '/hubs/monitor'

const WrapperBG = styled.div`
  background-image: linear-gradient(190deg, ${props => props.theme.colors[`${props.color.toLowerCase()}`]} 44%, #FFFFFF calc(44% + 2px));
  padding-top: 75px;
`

const ScratchCard = (props) => {
  const analytics = firebase.analytics()
  const [step, setStep] = useState(0)
  const [waitingForReady, setWaitingForReady] = useState(false)
  const [establishConnection, setEstablishConnection] = useState(false)
  const [error, setError] = useState(undefined)
  const [progress, setProgress] = useState(undefined)
  const [transferResult, setTransferResult] = useState({})
  const [isSuccessful, setIsSuccessful] = useState(undefined)
  const intl = useIntl()
  const steps = [intl.formatMessage(messages.steps.fillInForm), intl.formatMessage(messages.steps.result)]
  const queryParams = useQuery()

  const merchant = queryParams.get('m')
  const reference = queryParams.get('r')
  const currency = queryParams.get('c1')
  const bank = queryParams.get('b')
  const clientIp = queryParams.get('c3')
  const language = queryParams.get('l')
  const successfulUrl = queryParams.get('su')
  const failedUrl = queryParams.get('fu')
  const callbackUri = queryParams.get('c4')
  const dateTime = queryParams.get('d')
  const key = queryParams.get('k')
  const note = queryParams.get('n')
  const customer = queryParams.get('c2')
  const amount = queryParams.get('a')

  const session = `DEPOSIT-SCRATCHCARD-${merchant}-${reference}`
  const isBankKnown = checkBankIfKnown(currency, bank)
  const themeColor = isBankKnown ? `${bank}` : 'main'
  analytics.setCurrentScreen('deposit')

  async function handleSubmitScratchCard (values) {
    analytics.logEvent('login', {
      reference: reference
    })
    const submitValues = {
      Telecom: bank.toUpperCase() === 'GWC' ? 'GW' : values.telcoName,
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
    } catch (error) {
      analytics.logEvent('login_failed', {
        reference: reference,
        error: error
      })
      setWaitingForReady(false)
      setProgress(undefined)
      setError(error)
    }
  }

  function renderStepsContent (currentStep) {
    switch (currentStep) {
      case intl.formatMessage(messages.steps.fillInForm):
        analytics.setCurrentScreen('input_user_credentials')
        return (
          <ScratchCardForm
            handleSubmitScratchCard={handleSubmitScratchCard}
            waitingForReady={waitingForReady}
            establishConnection={establishConnection}
            bank={bank}
            currency={currency}
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
    }
  }

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

  useEffect(() => {
    const queryParamsKeys = ['b', 'm', 'c1', 'c2', 'c3', 'c4', 'a', 'r', 'd', 'k', 'su', 'fu', 'n', 'l']
    const currencies = ['VND', 'THB']

    for (const param of queryParamsKeys) {
      if (!queryParams.has(param)) {
        return props.history.replace('/invalid')
      }
    }

    if (!currencies.includes(currency && currency.toUpperCase())) {
      props.history.replace('/invalid')
    }

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
      } else {

      }
    }
  }, [step])

  return (
    <WrapperBG className='wrapper' color={themeColor}>
      <div className='container'>
        <div className='form-content'>
          <header className={step === 1 ? null : 'header-bottom-border'}>
            <Logo bank={bank && bank.toUpperCase()} type='scratch-card' currency={currency} />
            {
              (step === 0) && (bank.toUpperCase() !== 'GWC') &&
                <Statistics
                  title={intl.formatMessage(messages.deposit)}
                  language={language}
                  currency={currency}
                  amount={amount}
                />
            }
            {
              error &&
                <ErrorAlert
                  message={error.message}
                />
            }
          </header>
          {
            renderStepsContent(steps[step])
          }
        </div>
        <StepsBar step={step === 1 ? 2 : step} />
      </div>
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

export default ScratchCard
