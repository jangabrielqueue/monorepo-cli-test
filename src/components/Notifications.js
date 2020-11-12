import React from 'react'
import styled from 'styled-components'
import messages from './messages'
import { injectIntl } from 'react-intl'

const StyledCountdown = styled.div`
  position: absolute;
  top: 0;
  padding: 10px;
  background: #ffffcc;
  color: #3e3e3e;
  font-size: 14px;

  b {
    font-weight: 700;
    color: black;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  @media (max-width: 33.750em) {
    font-size: 12px;
  }
`

const Notifications = ({ bank, language, intl }) => {
  return (
    <>
      {
        bank && bank.toUpperCase() === 'VCB' &&
          <StyledCountdown>
            <ul>
              <li>{intl.formatMessage(messages.notifications.hasVCB, { fontWeightText: <b>{language === 'vi-vn' ? 'Tên đăng nhập là Số điện thoại đăng ký dịch vụ.' : 'Username is Phone number registered for this service.'}</b> })}</li>
              <li>{intl.formatMessage(messages.notifications.noVCB, { fontWeightText: <b>{language === 'vi-vn' ? 'Tên đăng nhập là Tên đăng nhập VCB-iB@nking' : 'Username is VCB-iB@nking username'}</b> })}</li>
            </ul>
          </StyledCountdown>
      }
    </>
  )
}

export default injectIntl(Notifications)
