import React, { useState, useEffect } from 'react'
import { injectIntl } from 'react-intl'
import messages from './messages'
import styled from 'styled-components'

const StyledCountdown = styled.section`
  > h1 {
      color: #767676;
      font-size: 16px;
      margin-bottom: ${props => props.redirect ? '10px' : '4px'};
  }
`
const StyledCountdownTimer = styled.p`
  color: #3f3f3f;
  font-family: ProductSansBold;
  font-size: 24px;
  margin: 0;
`

const StyledCountdownTimerQR = styled.p`
  margin: 0 0 25px;

  > span {
    color: #3f3f3f;
    font-family: ProductSansBold;
  }
`

const Countdown = ({ redirect, intl, minutes, seconds, qrCode }) => {
  const [timerMinutes, setTimerMinutes] = useState(minutes)
  const [timerSeconds, setTimerSeconds] = useState(seconds)

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
        setTimerMinutes(minutes)
        setTimerSeconds(seconds)
      }
    }, 1000)

    return () => {
      clearInterval(timer) // clear the timer on unmount
    }
  }, [minutes, seconds])

  return (
    <StyledCountdown redirect={redirect}>
      {
        !qrCode && <h1>{redirect ? intl.formatMessage(messages.texts.redirected, { timeLeft: seconds / 1 }) : intl.formatMessage(messages.countdown)}</h1>
      }
      {
        !qrCode ? <StyledCountdownTimer>00:0{timerMinutes}:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}</StyledCountdownTimer>
          : <StyledCountdownTimerQR>{intl.formatMessage(messages.countdown)}: <span>00:0{timerMinutes}:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}</span></StyledCountdownTimerQR>
      }
    </StyledCountdown>
  )
}

export default injectIntl(Countdown)
