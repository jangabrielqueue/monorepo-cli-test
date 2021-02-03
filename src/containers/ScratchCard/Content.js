import React, { lazy, useContext, memo } from 'react'
import styled from 'styled-components'
import { FirebaseContext } from '../../contexts/FirebaseContext'
import { QueryParamsContext } from '../../contexts/QueryParamsContext'
import { useIntl } from 'react-intl'
import messages from './messages'

// lazy loaded components
const ScratchCardForm = lazy(() => import('./forms/ScratchCardForm'))
const TransferSuccessful = lazy(() => import('../../components/TransferSuccessful'))
const TransferFailed = lazy(() => import('../../components/TransferFailed'))
const TransferWaitForConfirm = lazy(() => import('../../components/TransferWaitForConfirm'))
const AutoRedirect = lazy(() => import('../../components/AutoRedirect'))

// styling
const StyledBody = styled.section`
  padding: 20px;
  position: relative;
`

export default memo(function Content (props) {
  const {
    step,
    handleSubmitScratchCard,
    waitingForReady,
    establishConnection,
    isSuccessful,
    transferResult
  } = props
  const {
    bank,
    currency,
    successfulUrl,
    failedUrl
  } = useContext(QueryParamsContext)
  const analytics = useContext(FirebaseContext)
  const intl = useIntl()
  const steps = [intl.formatMessage(messages.steps.fillInForm), intl.formatMessage(messages.steps.result)]

  function renderStepContents () {
    switch (steps[step]) {
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
})
