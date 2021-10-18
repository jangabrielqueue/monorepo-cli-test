import React from 'react'
import messages from './messages'
import { FormattedMessage } from 'react-intl'
import { createUseStyles } from 'react-jss'

// styling
const useStyles = createUseStyles({
  container: {
    textAlign: 'center',
    color: '#2E2E2E',
    position: 'relative',
    top: '33%',

    '& h1': {
      fontSize: '130px',
      margin: '0',
      lineHeight: 1,
      fontWeight: '600'
    },

    '& p': {
      margin: '20px 0',
      fontSize: '24px'
    }
  }
})

const NotFound = () => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <h1>404</h1>
      <p><FormattedMessage {...messages.errors.pageDoesNoExist} /></p>
    </div>
  )
}

export default NotFound
