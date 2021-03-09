import React from 'react'
import { createUseStyles } from 'react-jss'

// styling
const useStyles = createUseStyles({
  loadingIconContainer: {
    textAlign: 'center'
  }
})

const LoadingIcon = () => {
  const classes = useStyles()

  return (
    <div className={classes.loadingIconContainer}>
      <div className='loading' />
    </div>
  )
}

export default LoadingIcon
