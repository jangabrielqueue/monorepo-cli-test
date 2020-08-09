import React from 'react'
import messages from './messages'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

const StyledInvalidContainer = styled.div`
  text-align: center;

  h1 {
    font-size: 50px;
    padding: 150px 0 0;
    margin: 0;
    line-height: 1;
  }

  p {
    margin: 20px 0;
  }
`

const InvalidPage = (props) => {
  return (
    <StyledInvalidContainer>
      <h1><FormattedMessage {...messages.errors.submissionFailed} /></h1>
      <p><FormattedMessage {...messages.errors.invalidParameters} /></p>
    </StyledInvalidContainer>
  )
}

export default InvalidPage
