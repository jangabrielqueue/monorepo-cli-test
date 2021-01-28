import React, { useEffect, lazy } from 'react'
import styled from 'styled-components'

// lazy loaded components
const Countdown = lazy(() => import('./Countdown'))

// styling
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
    <>
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
    </>
  )
}

export default AutoRedirect
