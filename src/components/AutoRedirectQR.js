import React, { useEffect } from 'react'
import Countdown from './Countdown'

const AutoRedirectQR = ({ children, delay, setStep }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      setStep(1)
    }, delay)

    return () => {
      clearTimeout(timeout)
    }
  }, [delay, setStep])

  return (
    <main>
      <Countdown
        qrCode
        minutes={3}
        seconds={0}
      />
      {
        children
      }
    </main>
  )
}

export default AutoRedirectQR
