import React, { lazy, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { QueryParamsContext } from '../../contexts/QueryParamsContext'

// lazy loaded components
const DepositForm = lazy(() => import('./forms/DepositForm'))
const OTPForm = lazy(() => import('./forms/OTPForm'))
const MandiriForm = lazy(() => import('./forms/MandiriForm'))
const TransferSuccessful = lazy(() => import('../../components/TransferSuccessful'))
const TransferFailed = lazy(() => import('../../components/TransferFailed'))
const TransferWaitForConfirm = lazy(() => import('../../components/TransferWaitForConfirm'))
const AutoRedirect = lazy(() => import('../../components/AutoRedirect'))

// styling
const StyledBody = styled.section`
  padding: 20px;
  position: relative;
`

export default function Content (props) {
  const {
    step,
    handleSubmitDeposit,
    handleSubmitOTP,
    waitingForReady,
    establishConnection,
    transferResult,
    isCardOTP,
    otpReference,
    progress,
    isSuccessful,
    language,
    analytics
  } = props
  const {
    bank,
    successfulUrl,
    failedUrl
  } = useContext(QueryParamsContext)
  const [dynamicLoadBankUtils, setDynamicLoadBankUtils] = useState(null)

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
    } else if (dynamicLoadBankUtils?.checkIfMandiriBank(bank) && step === 1) {
      analytics.setCurrentScreen('input_otp')
      return (
        <MandiriForm
          otpReference={otpReference}
          handleSubmitOTP={handleSubmitOTP}
          waitingForReady={waitingForReady}
        />
      )
    } else if (step === 1) {
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
    async function dynamicLoadModules () { // dynamically load bank utils
      const { checkIfMandiriBank } = await import('../../utils/banks')
      setDynamicLoadBankUtils({
        checkIfMandiriBank
      })
    }

    dynamicLoadModules()
  }, [])

  return (
    <StyledBody>
      {
        renderStepContents()
      }
    </StyledBody>
  )
}
