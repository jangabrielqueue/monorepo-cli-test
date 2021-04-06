import React from 'react'
import messages from './messages'
import { injectIntl } from 'react-intl'
import { createUseStyles, useTheme } from 'react-jss'

// styling
const useStyles = createUseStyles({
  countDownContainer: {
    position: 'absolute',
    top: 0,
    padding: '10px',
    background: ({ bank, theme }) => bank === 'BIDV' ? theme.colors.notificationBIDV : theme.colors.notificationVCB,
    color: '#3e3e3e',
    fontSize: '14px',
    margin: ({ bank }) => bank === 'BIDV' && 20,
    borderRadius: ({ bank }) => bank === 'BIDV' && 12,

    '& b': {
      fontWeight: 700,
      color: ({ bank, theme }) => bank === 'BIDV' ? theme.colors.notificationFontBIDV : 'black'
    },

    '& ul': {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      color: ({ bank, theme }) => bank === 'BIDV' && theme.colors.notificationFontBIDV,
      letterSpacing: 0.4,

      '& li': {
        margin: 0,
        '&:before': {
          content: "'\\2022'",
          color: ({ bank }) => bank === 'BIDV' ? '#00bfae' : 'black',
          fontWeight: 'bold',
          display: 'inline-block',
          width: '1em',
          fontSize: '1em'
        }
      }
    },

    '@media (max-width: 33.750em)': {
      fontSize: '12px'
    }
  }
})

const Notifications = ({ language, intl, bank }) => {
  const theme = useTheme()
  const classes = useStyles({ bank, theme })

  function renderBankNotificationMessages () {
    switch (bank) {
      case 'VCB':
        return (
          <ul>
            <li>{intl.formatMessage(messages.notifications.hasVCB, { fontWeightText: <b>{language === 'vi-vn' ? 'Tên đăng nhập là Số điện thoại đăng ký dịch vụ' : 'Username is phone number registered for this service'}</b> })}</li>
            <li>{intl.formatMessage(messages.notifications.noVCB, { fontWeightText: <b>{language === 'vi-vn' ? 'Tên đăng nhập là Tên đăng nhập VCB-iB@nking' : 'Username is VCB-iB@nking username'}</b> })}</li>
          </ul>
        )
      case 'BIDV':
        return (
          <ul>
            <li>{intl.formatMessage(messages.notifications.hasBIDV, { fontWeightText: <b>{language === 'vi-vn' ? 'Tên đăng nhập là Số điện thoại đăng ký dịch vụ' : 'Username is the phone number that is registered for service'}</b> })}</li>
            <li>{intl.formatMessage(messages.notifications.noBIDV, { fontWeightText: <b>{language === 'vi-vn' ? 'Tên đăng nhập là Tên đăng nhập của BIDV Online' : 'Username is the username of BIDV Online'}</b> })}</li>
          </ul>
        )
    }
  }
  return (
    <div className={classes.countDownContainer}>
      {
        renderBankNotificationMessages()
      }
    </div>
  )
}

export default injectIntl(Notifications)
