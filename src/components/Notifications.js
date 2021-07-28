import React from 'react'
import messages from './messages'
import { FormattedMessage } from 'react-intl'
import { createUseStyles, useTheme } from 'react-jss'

const textFormatter = {
  b: msg => (
    <b>
      {msg}
    </b>
  ),
  red: msg => (
    <red>{msg}</red>
  )
}

// styling
const useStyles = createUseStyles({
  countDownContainer: {
    padding: '10px',
    background: ({ bank, theme }) => bank === 'BIDV' ? theme.colors.notificationBIDV : theme.colors.notificationVCB,
    color: '#3e3e3e',
    fontSize: '14px',
    margin: '20px 0',
    borderRadius: '12px',

    '& b': {
      fontWeight: 700,
      color: ({ bank, theme }) => bank === 'BIDV' ? theme.colors.notificationFontBIDV : 'black'
    },

    '& red': {
      fontWeight: 700,
      color: () => 'red'
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
            <li>
              <FormattedMessage
                {...messages.notifications.hasVCB}
                values={textFormatter}
              />
            </li>
            <li>
              <FormattedMessage
                {...messages.notifications.noVCB}
                values={textFormatter}
              />
            </li>
          </ul>
        )
      case 'BIDV':
        return (
          <ul>
            <li>
              <FormattedMessage
                {...messages.notifications.hasBIDV}
                values={textFormatter}
              />
            </li>
            <li>
              <FormattedMessage
                {...messages.notifications.noBIDV}
                values={textFormatter}
              />
            </li>
          </ul>
        )
      default:
        break
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

export default Notifications
