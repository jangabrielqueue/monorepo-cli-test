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
