import React from 'react'
// import { FormattedMessage } from 'react-intl'
// import messages from './messages'
import { createUseStyles } from 'react-jss'

// styling
const useStyles = createUseStyles({
  verifyTransactionContainer: {
    textAlign: 'center',

    '& img': {
      margin: '30px 0',
      maxWidth: '45px'
    },

    '& h1': {
      color: '#767676',
      fontFamily: 'ProductSansMedium',
      fontSize: '16px',
      lineHeight: 1.5,

      '& span': {
        display: 'block',
        paddingTop: 10
      }
    }
  }
})

const VerifyTransaction = ({ language }) => {
  const classes = useStyles()

  return (
    <div className={classes.verifyTransactionContainer}>
      <img alt='submit-verification' src='/icons/submit-verification.png' />
      <h1>We are verifying the transaction. <br /> Please wait for the status of your transaction. <span>Thank you!</span></h1>
    </div>
  )
}

export default VerifyTransaction
