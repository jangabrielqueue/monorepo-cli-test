import React, { useState, useEffect } from 'react'
import { injectIntl } from 'react-intl'
import messages from './messages'
import { createUseStyles } from 'react-jss'

// styling
const useStyles = createUseStyles({
  countdownHeaderText: {
    color: '#767676',
    fontSize: '16px',
    marginBottom: (props) => props?.redirect ? '10px' : '4px'
  },
  countdownTimer: {
    color: '#3f3f3f',
    fontFamily: 'ProductSansBold',
    fontSize: '24px',
    margin: 0
  },
  countdownTimerQr: {
    margin: '0 0 15px',

    '& span': {
      color: '#3f3f3f',
      fontFamily: 'ProductSansBold'
    }
  }
})

const Countdown = ({ redirect, intl, minutes, seconds, qrCode, reRender }) => {
  const [formattedTime, setFormattedTime] = useState('00:00')
  const classes = useStyles(redirect)

  useEffect(() => {
    const dateTime = new Date()
    const countdownTime = dateTime.setMinutes(dateTime.getMinutes() + minutes, dateTime.getSeconds() + seconds)

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = countdownTime - now

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      if (distance < 0) {
        // stop timer
        clearInterval(timer)
      } else {
        // update timer
        setFormattedTime(`${formatTime(minutes)}:${formatTime(seconds)}`)
      }
    }, 1000)

    const formatTime = (time) => {
      return time.toString().padStart(2, 0)
    }

    return () => {
      clearInterval(timer) // clear the timer on unmount
    }
  }, [minutes, seconds, reRender])

  return (
    <section>
      {
        !qrCode && <h1 className={classes.countdownHeaderText}>{redirect ? intl.formatMessage(messages.texts.redirected, { timeLeft: seconds / 1 }) : intl.formatMessage(messages.countdown)}</h1>
      }
      {
        !qrCode ? <p className={classes.countdownTimer}>00:{formattedTime}</p>
          : <p className={classes.countdownTimerQr}>{intl.formatMessage(messages.countdown)}: <span>00:{formattedTime}</span></p>
      }
    </section>
  )
}

export default injectIntl(Countdown)
