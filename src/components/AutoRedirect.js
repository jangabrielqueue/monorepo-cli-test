import React, { useEffect } from 'react'
import Countdown from './Countdown'
import styled from 'styled-components'

const StyledRedirectContainer = styled.div`
  padding: 0 15px;
`

const AutoRedirect = ({ children, delay, url }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.location.href = url
    }, delay)

    return () => {
      clearTimeout(timeout)
    }
  }, [delay, url])

  return (
    <main>
      <StyledRedirectContainer>
        <Countdown
          redirect
          minutes={0}
          seconds={10}
        />
      </StyledRedirectContainer>
      {
        children
      }
    </main>
  )
}

export default AutoRedirect
