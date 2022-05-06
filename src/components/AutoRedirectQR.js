import React, { useEffect } from 'react'
import Countdown from './Countdown'

const AutoRedirectQR = ({ children, delay, setStep, time, isTHB }) => {
  useEffect(() => {
    let timeout

    if (delay !== 0) { // this will stop redirecting when submitting even when the response took time
      timeout = setTimeout(() => {
        isTHB ? setStep(1) : setStep(2)
      }, delay)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [delay, setStep, time, isTHB])

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
