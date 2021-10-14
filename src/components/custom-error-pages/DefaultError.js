import React from 'react'
import messages from '../messages'
import { FormattedMessage } from 'react-intl'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  textContainer: {
    padding: '250px 0 0 0'
  }
})

const DefaultError = () => {
  const classes = useStyles()

  return (
    <div className={classes.textContainer}>
      <p><FormattedMessage {...messages.errors.defaultError} /></p>
    </div>
  )
}

export default DefaultError
