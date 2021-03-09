import React from 'react'
import { FormattedMessage } from 'react-intl'
import messages from './messages'
import { createUseStyles } from 'react-jss'

// styling
const useStyles = createUseStyles({
  accountStatisticsContainer: {
    listStyle: 'none',
    margin: 0,
    padding: 0,

    '& li': {
      display: 'flex',
      fontSize: '16px',
      fontWeight: '400',
      margin: '0 0 4px',

      '& span': {
        color: '#3f3f3f',
        fontFamily: 'ProductSansBold',
        height: '20px',
        marginLeft: '10px',
        minWidth: '20px'
      }
    }
  }
})

const AccountStatistics = ({ accountName, language, currency, amount, establishConnection }) => {
  const classes = useStyles()

  return (
    <ul className={classes.accountStatisticsContainer}>
      <li>{<FormattedMessage {...messages.account.amount} />}: <span>{!establishConnection ? <div className='loading' /> : `${currency} ${new Intl.NumberFormat(language).format(amount)}`}</span></li>
      <li>{<FormattedMessage {...messages.account.accountName} />}: <span>{!establishConnection ? <div className='loading' /> : accountName}</span></li>
    </ul>
  )
}

export default AccountStatistics
