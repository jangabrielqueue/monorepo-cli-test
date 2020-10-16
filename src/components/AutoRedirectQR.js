import React, { useEffect } from 'react'
import Countdown from './Countdown'

const AutoRedirectQR = ({ children, delay, setStep, timeoutPayload }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      setStep(1)
    }, delay)

    return () => {
      clearTimeout(timeout)
    }
  }, [delay, setStep, timeoutPayload])

  return (
    <main>
      <Countdown
        qrCode
        minutes={5}
        seconds={0}
      />
      {
        children
      }
    </main>
  )
}

export default AutoRedirectQR
