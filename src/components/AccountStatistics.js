import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import messages from './messages'
import { CircularProgress } from '@rmwc/circular-progress'
import '@rmwc/circular-progress/circular-progress.css'

const StyledAccountStatistics = styled.section`
  && {
    > div {
      font-size: 16px;
      font-weight: 400;
      margin: 0 0 4px;

      > span {
        color: #3f3f3f;
        font-family: ProductSansBold;
      }
    }
  }
`
const StyledCircularProgress = styled(CircularProgress)`
  color: ${props => props.theme.colors[props.color.toLowerCase()]} !important;
`

const AccountStatistics = ({ accountName, language, currency, amount, color, loading, establishConnection }) => {
  return (
    <StyledAccountStatistics>
      <div>{<FormattedMessage {...messages.account.amount} />}: <span>{!establishConnection ? <StyledCircularProgress size='small' color={color} /> : `${currency} ${new Intl.NumberFormat(language).format(amount)}`}</span></div>
      <div>{<FormattedMessage {...messages.account.accountName} />}: <span>{!establishConnection ? <StyledCircularProgress size='small' color={color} /> : accountName}</span></div>
    </StyledAccountStatistics>
  )
}

export default AccountStatistics
