import React, { lazy, useContext } from 'react'
import styled from 'styled-components'
import { QueryParamsContext } from '../../contexts/QueryParamsContext'

// lazy loaded components
const QRCodeForm = lazy(() => import('./forms/QRCodeForm'))
const TransferSuccessful = lazy(() => import('../../components/TransferSuccessful'))
const TransferFailed = lazy(() => import('../../components/TransferFailed'))
const AutoRedirect = lazy(() => import('../../components/AutoRedirect'))
const AutoRedirectQR = lazy(() => import('../../components/AutoRedirectQR'))

// styling
const StyledBody = styled.section`
  padding: 20px;
  position: relative;
`

export default function Content (props) {
  const {
    loadingButton,
    timeout,
    transferResult,
    handleSubmitQRCode,
    language,
    establishConnection,
    responseData,
    themeColor,
    error,
    step,
    setStep
  } = props
  const {
    bank,
    currency,
    successfulUrl,
    failedUrl
  } = useContext(QueryParamsContext)

  function renderStepContents () {
    switch (step) {
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

  return (
    <StyledBody>
      {
        renderStepContents()
      }
    </StyledBody>
  )
}
