import React from 'react'
import { createUseStyles } from 'react-jss'
import BadRequest from './custom-error-pages/BadRequest'
import PaymentNotSupported from './custom-error-pages/PaymentNotSupported'
import SameAccount from './custom-error-pages/SameAccount'
import SystemBusy from './custom-error-pages/SystemBusy'
import DefaultError from './custom-error-pages/DefaultError'

// styling
const useStyles = createUseStyles({
  container: {
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

const CustomErrorPages = () => {
  const classes = useStyles()
  const queryString = window.location.search
  const urlQueryString = new URLSearchParams(queryString)
  const errorCode = urlQueryString.get('code')

  function renderErrorPage (errorCode) {
    switch (errorCode) {
      case '400':
        return <BadRequest />
      case '600':
        return <SystemBusy />
      case '601':
        return <SameAccount />
      case '602':
        return <PaymentNotSupported />
      default:
        return <DefaultError />
    }
  }

  return (
    <div className={classes.container}>
      {
        renderErrorPage(errorCode)
      }
    </div>
  )
}

export default CustomErrorPages
