import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import Logo from '../../components/Logo'
import { checkBankIfKnown } from '../../utils/banks'
import ErrorAlert from '../../components/ErrorAlert'
import { useQuery, sleep } from '../../utils/utils'
import AccountStatistics from '../../components/AccountStatistics'
import AutoRedirectQR from '../../components/AutoRedirectQR'
import AutoRedirect from '../../components/AutoRedirect'
import QRCodeForm from './QRCodeForm'
import StepsBar from '../../components/StepsBar'
import {
  TransferSuccessful,
  TransferFailed
} from '../../components/TransferResult'
import messages from './messages'
import { useIntl } from 'react-intl'
import axios from 'axios'
import ProgressModal from '../../components/ProgressModal'
import * as signalR from '@microsoft/signalr'

const ENDPOINT = process.env.REACT_APP_ENDPOINT
const API_USER_COMMAND_MONITOR = ENDPOINT + '/hubs/monitor'

const WrapperBG = styled.div`
  background-image: linear-gradient(
    190deg,
    ${(props) => props.theme.colors[`${props.color.toLowerCase()}`]} 44%,
    #ffffff calc(44% + 2px)
  );
  padding-top: ${props => props.bank === 'VCB' ? '105px' : '75px'}
`

const QRCode = (props) => {
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
  const queryParams = useQuery()
  const intl = useIntl()
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
  const isBankKnown = checkBankIfKnown(currency, bank)
  const themeColor = isBankKnown ? `${bank}` : 'main'
  const session = `DEPOSIT-BANK-QRCODE-${merchant}-${reference}`
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

  function renderStepsContent (currentStep) {
    switch (currentStep) {
      case 0:
        return (
          <AutoRedirectQR delay={180000} setStep={setStep} time={timeout}>
            <QRCodeForm
              currency={currency}
              bank={bank}
              establishConnection={establishConnection}
              loadingButton={loadingButton}
              responseData={responseData}
              color={themeColor}
              handleSubmitQRCode={handleSubmitQRCode}
              error={error}
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
              <TransferFailed transferResult={transferResult} language={language} />
            </AutoRedirect>
          )
        }

      default:
        break
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
    }
  )

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
    const currencies = ['VND', 'THB']

    for (const param of queryParamsKeys) {
      if (!queryParams.has(param)) {
        setTransferResult({
          statusCode: '001',
          isSuccess: false,
          message: intl.formatMessage(messages.errors.verificationFailed)
        })
        setStep(1)
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
      setStep(1)
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
    intl
  ]) // disabling the react hooks recommended rule on this case because it forces to add getQRCodePayload as dependencies array
  // although dep array only needed on first load and would cause multiple rerendering if enforce as dep array. So for this case only will disable it to
  // avoid unnecessary warning

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
    <WrapperBG className='wrapper' bank={bank} color={themeColor}>
      <div className='container'>
        <div className='form-content'>
          <header className={step === 1 ? null : 'header-bottom-border'}>
            <Logo bank={bank} currency={currency} />
            {step === 0 && !error && (
              <AccountStatistics
                accountName={responseData.accountName}
                language={language}
                currency={currency}
                amount={responseData.amount}
                color={themeColor}
                establishConnection={establishConnection}
              />
            )}
            {error && step === 0 && <ErrorAlert message={`Error ${error.code}: ${error.message}`} />}
          </header>
          {
            renderStepsContent(step)
          }
        </div>
        <StepsBar step={step === 1 ? 2 : step} />
      </div>
      <ProgressModal open={progress}>
        <div className='progress-bar-container'>
          <img
            alt='submit-transaction'
            width='80'
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
    </WrapperBG>
  )
}

export default QRCode
