import React, { useEffect, lazy } from 'react'
import { createUseStyles } from 'react-jss'

// lazy loaded components
const Countdown = lazy(() => import('./Countdown'))

// styling
const useStyles = createUseStyles({
  redirectContainer: {
    padding: '0 15px'
  }
})

const AutoRedirect = ({ children, delay, url }) => {
  const classes = useStyles()

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
      <div className={classes.redirectContainer}>
        <Countdown
          redirect
          minutes={0}
          seconds={10}
        />
      </div>
      {
        children
      }
    </>
  )
}

export default AutoRedirect
