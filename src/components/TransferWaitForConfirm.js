import React from 'react'
import { FormattedMessage } from 'react-intl'
import messages from './messages'
import styled from 'styled-components'

const StyledRedirectContent = styled.div`
  text-align: center;

  img {
    margin: 30px 0;
  }

  h1 {
    color: #767676;
    font-family: ProductSansMedium;
    font-size: 18px;
  }

  h2 {
    color: #767676;
    font-family: ProductSansMedium;
    font-size: 17px;
    margin: 25px 0;
  }

  p {
    color: #767676;
    font-size: 16px;
    margin: 25px 0;
  }
`

const TransferWaitForConfirm = ({ transferResult }) => {
  return (
    <StyledRedirectContent>
      <h2>{<FormattedMessage {...messages.progress.pendingConfirmation} />}</h2>
      <p>{transferResult.message || transferResult.statusMessage}</p>
    </StyledRedirectContent>
  )
}

export default TransferWaitForConfirm
