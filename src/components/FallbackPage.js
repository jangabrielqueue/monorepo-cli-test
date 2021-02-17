import React, { memo } from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  fallbackContainer: {
    margin: '0 20px',
    maxWidth: '500px',
    width: '100%'
  },
  fallbackContent: {
    background: '#FFFFFF',
    borderRadius: '15px',
    boxShadow: '0px 5px 10px 0px rgba(112,112,112,0.3)'
  },
  fallback: {
    alignTtems: 'center',
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '500px',
    minHeight: '500px'
  }
})

const FallbackPage = () => {
  const classes = useStyles()

  return (
    <div className={classes}>
      <div className={classes}>
        <div className={classes} />
      </div>
    </div>
  )
}

export default memo(FallbackPage)
