import React, { Suspense, lazy, memo, useContext } from 'react'
import styled from 'styled-components'
import LoadingIcon from '../../components/LoadingIcon'
import { useIntl } from 'react-intl'
import messages from './messages'
import { QueryParamsContext } from '../../contexts/QueryParamsContext'

// lazy loaded components
const Logo = lazy(() => import('../../components/Logo'))
const Statistics = lazy(() => import('../../components/Statistics'))
const Countdown = lazy(() => import('../../components/Countdown'))
const ErrorAlert = lazy(() => import('../../components/ErrorAlert'))

// styling
const StyledHeader = styled.section`
  padding: 10px 20px;
  border-bottom: ${props => props.step === 2 ? '#FFF' : '0.5px solid #E3E3E3'};
`

export default memo(function Header (props) {
  const {
    themeColor,
    step,
    language,
    error
  } = props
  const {
    bank,
    currency,
    amount
  } = useContext(QueryParamsContext)
  const intl = useIntl()

  return (
    <StyledHeader step={step}>
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
        step === 1 && (
          <Countdown minutes={3} seconds={0} />
        )
      }
      {
        error && <ErrorAlert message={error.message} />
      }
    </StyledHeader>
  )
})
