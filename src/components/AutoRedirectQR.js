import React, { useEffect } from 'react'
import Countdown from './Countdown'

const AutoRedirectQR = ({ children, delay, setStep, hubConnection, timeoutPayload }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      hubConnection.send('QrCodeDPUpdateProgress', timeoutPayload)
      setStep(1)
    }, delay)

    return () => {
      clearTimeout(timeout)
    }
  }, [delay, setStep, hubConnection])

  return (
    <main>
      {
        hubConnection && hubConnection.connectionStarted &&
          <Countdown
            qrCode
            minutes={3}
            seconds={0}
          />
      }
      {
        children
      }
    </main>
  )
}

export default AutoRedirectQR
