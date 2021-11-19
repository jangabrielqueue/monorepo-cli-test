import React from 'react'
// import { FormattedMessage } from 'react-intl'
// import messages from './messages'
import { createUseStyles } from 'react-jss'

// styling
const useStyles = createUseStyles({
  verifyTransactionContainer: {
    textAlign: 'center',

    '& img': {
      margin: '30px 0'
    },

    '& h1': {
      color: '#767676',
      fontFamily: 'ProductSansMedium',
      fontSize: '18px',

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
      <img alt='submit-success' src='/icons/submit-success.svg' />
      <h1>We are verifying the transaction. <span>Thanks!</span></h1>
    </div>
  )
}

export default VerifyTransaction
