import React from 'react'
import messages from './messages'
import { FormattedMessage } from 'react-intl'
import { createUseStyles } from 'react-jss'

// styling
const useStyles = createUseStyles({
  notFoundContainer: {
    textAlign: 'center',

    '& h1': {
      fontSize: '100px',
      padding: '150px 0 0',
      margin: '0',
      lineHeight: 1
    },

    '& p': {
      margin: '20px 0'
    }
  }
})

const NotFound = () => {
  const classes = useStyles()

  return (
    <div className={classes.notFoundContainer}>
      <h1>404</h1>
      <p><FormattedMessage {...messages.errors.pageDoesNoExist} /></p>
    </div>
  )
}

export default NotFound
