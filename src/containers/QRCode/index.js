import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Logo from '../../components/Logo'
import { checkBankIfKnown } from '../../utils/banks'
import ErrorAlert from '../../components/ErrorAlert'
import { useQuery } from '../../utils/utils'
import AccountStatistics from '../../components/AccountStatistics'
import AutoRedirectRQ from '../../components/AutoRedirectQR'
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
  const [waitingForReady, setWaitingForReady] = useState(false)
  const [loadingButton, setLoadingButton] = useState(false)
  const [error, setError] = useState()
  const [responseData, setResponseData] = useState({
    encodedImage: '',
    toAccountId: null
  })
  const [progress, setProgress] = useState()
  const [isSuccessful, setIsSuccessful] = useState(undefined)
  const [transferResult, setTransferResult] = useState({})
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
      toAccountId: responseData.toAccountId
    }
    setLoadingButton(true)

    try {
      const response = await axios({
        url: 'api/depositqrcode',
        method: 'POST',
        data: submitValues
      })
    } catch (error) {
      setError(error)
    }
  }

  function renderStepsContent (currentStep) {
    switch (currentStep) {
      case 0:
        return (
          <AutoRedirectRQ delay={180000} setStep={setStep} step={step}>
            <QRCodeForm
              currency={currency}
              bank={bank}
              waitingForReady={waitingForReady}
              responseData={responseData}
              color={themeColor}
              handleSubmitQRCode={handleSubmitQRCode}
            />
          </AutoRedirectRQ>
        )

      case 1:
        if (isSuccessful) {
          return (
            <AutoRedirect delay={10000} url={successfulUrl}>
              <TransferSuccessful transferResult={transferResult} />
            </AutoRedirect>
          )
        } else {
          return (
            <AutoRedirect delay={10000} url={failedUrl}>
              <TransferFailed transferResult={transferResult} />
            </AutoRedirect>
          )
        }

      default:
        break
    }
  }

  async function getQRCodeDetails () {
    setWaitingForReady(true)

    const requestBody = {
      bank: bank,
      merchant: merchant,
      currency: currency,
      amount: amount
    }

    try {
      const response = await axios({
        url: 'api/depositqrcode/get-qrcode',
        method: 'POST',
        data: requestBody
      })
      setResponseData(response.data)
      setWaitingForReady(false)
    } catch (error) {
      setError(error)
      setWaitingForReady(false)
    }
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
    // get qr code
    getQRCodeDetails()
  }, [])

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
    <WrapperBG className='wrapper' bank={bank} color={themeColor}>
      <div className='container'>
        <div className='form-content'>
          <header className={step === 1 ? null : 'header-bottom-border'}>
            <Logo bank={bank} currency={currency} />
            {step === 0 && (
              <AccountStatistics
                accountName={requester}
                language={language}
                currency={currency}
                amount={amount}
              />
            )}
          </header>
          {
            renderStepsContent(step)
          }
        </div>
        <StepsBar step={step === 1 ? 2 : step} />
      </div>
    </WrapperBG>
  )
}

export default QRCode
