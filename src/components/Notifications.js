import React from 'react'
import messages from './messages'
import { injectIntl } from 'react-intl'
import { createUseStyles } from 'react-jss'

// styling
const useStyles = createUseStyles({
  countDownContainer: {
    position: 'absolute',
    top: 0,
    padding: '10px',
    background: '#ffffcc',
    color: '#3e3e3e',
    fontSize: '14px',

    '& b': {
      fontWeight: 700,
      color: 'black'
    },

    '& ul': {
      listStyle: 'none',
      margin: 0,
      padding: 0
    },
    '@media (max-width: 33.750em)': {
      fontSize: '12px'
    }
  }
})

const Notifications = ({ language, intl }) => {
  const classes = useStyles()

  return (
    <div className={classes.countDownContainer}>
      <ul>
        <li>{intl.formatMessage(messages.notifications.hasVCB, { fontWeightText: <b>{language === 'vi-vn' ? 'Tên đăng nhập là Số điện thoại đăng ký dịch vụ.' : 'Username is Phone number registered for this service.'}</b> })}</li>
        <li>{intl.formatMessage(messages.notifications.noVCB, { fontWeightText: <b>{language === 'vi-vn' ? 'Tên đăng nhập là Tên đăng nhập VCB-iB@nking' : 'Username is VCB-iB@nking username'}</b> })}</li>
      </ul>
    </div>
  )
}

export default injectIntl(Notifications)
