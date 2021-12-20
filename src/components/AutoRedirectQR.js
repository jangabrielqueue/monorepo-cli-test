import React, { useEffect } from 'react'
import Countdown from './Countdown'

const AutoRedirectQR = ({ children, delay, setStep, time }) => {
  useEffect(() => {
    let timeout

    if (delay !== 0) { // this will stop redirecting when submitting even when the response took time
      timeout = setTimeout(() => {
        setStep(1)
      }, delay)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [delay, setStep, time])

  return (
    <main>
      <Countdown
        qrCode
        minutes={time.minutes}
        seconds={time.seconds}
      />
      {
        children
      }
    </main>
  )
}

export default AutoRedirectQR
