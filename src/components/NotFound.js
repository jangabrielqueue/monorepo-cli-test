import React from 'react'
import messages from './messages'
import { FormattedMessage } from 'react-intl'
import { createUseStyles } from 'react-jss'

// styling
const useStyles = createUseStyles({
  container: {
    textAlign: 'center',
    color: '#3f3f3f',
    position: 'relative',
    top: '33%',

    '& h1': {
      fontSize: '110px',
      margin: '0',
      lineHeight: 1,
      fontWeight: '600'
    },

    '& p': {
      margin: '20px 0',
      fontSize: '22px'
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
