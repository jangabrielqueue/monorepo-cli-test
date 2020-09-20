import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import messages from './messages'

const StyledAccountStatistics = styled.section`
    > p {
      font-size: 16px;
      font-weight: 400;
      margin: 0 0 4px;

      > span {
        color: #3f3f3f;
        font-family: ProductSansBold;
      }
    }
`

const AccountStatistics = ({ accountName, language, currency, amount }) => {
  return (
    <StyledAccountStatistics>
      <p>{<FormattedMessage {...messages.account.amount} />}: <span>{`${currency} ${new Intl.NumberFormat(language).format(amount)}`}</span></p>
      <p>{<FormattedMessage {...messages.account.accountName} />}: <span>{accountName}</span></p>
    </StyledAccountStatistics>
  )
}

export default AccountStatistics
