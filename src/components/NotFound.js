import React from 'react'
import messages from './messages'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

const StyledErrorContainer = styled.div`
  text-align: center;

  h1 {
    font-size: 100px;
    padding: 150px 0 0;
    margin: 0;
    line-height: 1;
  }

  p {
    margin: 20px 0;
  }
`

const NotFound = (props) => {
  return (
    <StyledErrorContainer>
      <h1>404</h1>
      <p><FormattedMessage {...messages.errors.pageDoesNoExist} /></p>
    </StyledErrorContainer>
  )
}

export default NotFound
