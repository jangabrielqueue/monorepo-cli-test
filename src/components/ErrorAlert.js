import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  errorAlertContainer: {
    backgroundColor: '#fff1f0',
    borderRadius: '4px',
    border: '1px solid #ffa39e',
    lineHeight: 1.5,
    padding: '15px',

    '& p': {
      color: 'rgba(0, 0, 0, 0.65)',
      fontSize: '14px',
      lineHeight: '22px',
      margin: 0,
      wordBreak: 'break-all',

      '& img': {
        verticalAlign: 'bottom',
        marginRight: '10px'
      }
    }
  }
})

const ErrorAlert = ({ message }) => {
  const classes = useStyles()

  return (
    <section className={classes.errorAlertContainer}>
      <p>
        <img alt='error' width='24' src='/icons/error.png' />
        {message}
      </p>
    </section>
  )
}

export default ErrorAlert
