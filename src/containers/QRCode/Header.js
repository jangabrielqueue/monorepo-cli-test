import React, { Suspense, lazy, memo, useContext } from 'react'
import styled from 'styled-components'
import LoadingIcon from '../../components/LoadingIcon'
import { QueryParamsContext } from '../../contexts/QueryParamsContext'

// lazy loaded components
const Logo = lazy(() => import('../../components/Logo'))
const AccountStatistics = lazy(() => import('../../components/AccountStatistics'))
const ErrorAlert = lazy(() => import('../../components/ErrorAlert'))

// styling
const StyledHeader = styled.section`
  padding: 10px 20px;
  border-bottom: ${props => props.step === 1 ? '#FFF' : '0.5px solid #E3E3E3'};
`

export default memo(function Header (props) {
  const {
    themeColor,
    step,
    language,
    error,
    responseData,
    establishConnection
  } = props
  const {
    bank,
    currency
  } = useContext(QueryParamsContext)

  return (
    <StyledHeader step={step}>
      <Suspense fallback={<LoadingIcon size='large' color={themeColor} />}>
        <Logo bank={bank} currency={currency} />
      </Suspense>
      {
        step === 0 && !error && (
          <AccountStatistics
            accountName={responseData.accountName}
            language={language}
            currency={currency}
            amount={responseData.amount}
            color={themeColor}
            establishConnection={establishConnection}
          />
        )
      }
      {
        error && step === 0 &&
          <ErrorAlert message={`Error ${error.code}: ${error.message}`} />
      }
    </StyledHeader>
  )
})
