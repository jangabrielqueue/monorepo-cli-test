import React, { Suspense, lazy, memo, useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import LoadingIcon from './LoadingIcon'
import { useIntl } from 'react-intl'
import messages from './messages'
import { QueryParamsContext } from '../contexts/QueryParamsContext'

// lazy loaded components
const Logo = lazy(() => import('./Logo'))
const Statistics = lazy(() => import('./Statistics'))
const Countdown = lazy(() => import('./Countdown'))
const ErrorAlert = lazy(() => import('./ErrorAlert'))

// styling
const StyledHeader = styled.section`
  padding: 10px 20px;
  border-bottom: ${props => props.step !== 2 ? '0.5px solid #E3E3E3' : '#FFF'};
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
  const [dynamicLoadBankUtils, setDynamicLoadBankUtils] = useState(null)

  useEffect(() => {
    async function dynamicLoadModules () { // dynamically load bank utils
      const { checkIfMandiriBank } = await import('../utils/banks')
      setDynamicLoadBankUtils({
        checkIfMandiriBank
      })
    }

    dynamicLoadModules()
  }, [])

  return (
    <StyledHeader>
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
        step === 1 && !dynamicLoadBankUtils?.checkIfMandiriBank(bank) && (
          <Countdown minutes={3} seconds={0} />
        )
      }
      {
        error && <ErrorAlert message={error.message} />
      }
    </StyledHeader>
  )
})
