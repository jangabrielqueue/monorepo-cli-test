import React, { lazy } from 'react'
import styled from 'styled-components'

// lazy loaded components
const DepositForm = lazy(() => import('./forms/DepositForm'))
const OTPForm = lazy(() => import('./forms/OTPForm'))
const TransferSuccessful = lazy(() => import('../../components/TransferSuccessful'))
const TransferFailed = lazy(() => import('../../components/TransferFailed'))

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
    otpReference,
    progress,
    isSuccessful,
    language,
    analytics
  } = props

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
      analytics.setCurrentScreen('input_otp')
      return (
        <OTPForm
          otpReference={otpReference}
          handleSubmitOTP={handleSubmitOTP}
          waitingForReady={waitingForReady}
          progress={progress}
        />
      )
    } else if (step === 2 && isSuccessful) {
      analytics.setCurrentScreen('transfer_successful')
      return (
        <TransferSuccessful
          transferResult={transferResult}
          language={language}
        />
      )
    } else if (step === 2) {
      analytics.setCurrentScreen('transfer_failed')
      return (
        <TransferFailed transferResult={transferResult} />
      )
    }
  }

  return (
    <StyledBody>
      {
        renderStepContents()
      }
    </StyledBody>
  )
}
