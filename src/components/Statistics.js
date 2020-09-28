import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import messages from './messages'

const StyledStatisticsTitle = styled.ul`
  display: flex;
  justify-content: space-between;
  list-style: none;
  margin: 0 0 4px;
  padding: 0;

    > li:nth-child(1),
    li:nth-child(2) {
      font-size: 16px;
      font-weight: 400;
    }
`

const StyledStatisticsText = styled.ul`
  display: flex;
  justify-content: space-between;
  list-style: none;
  margin: 0 0 4px;
  padding: 0;

    > li:nth-child(1),
    li:nth-child(2) {
      color: #3f3f3f;
      font-family: ProductSansBold;
      font-size: 18px;
    }

    > li:nth-child(2) {
      text-align: right;
    }
`

const Statistics = ({ title, language, currency, amount, reference }) => {
  return (
    <>
      <StyledStatisticsTitle>
        <li>{title}</li>
        <li><FormattedMessage {...messages.reference} /></li>
      </StyledStatisticsTitle>
      <StyledStatisticsText>
        <li>{`${currency} ${new Intl.NumberFormat(language).format(amount)}`}</li>
        <li>{reference}</li>
      </StyledStatisticsText>
    </>
  )
}

export default Statistics
