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
      margin: '0 0 5px',

      '&:last-child': {
        fontSize: '14px',
        fontStyle: 'italic'
      },

      '& span': {
        color: '#3f3f3f',
        fontFamily: 'ProductSansBold',
        marginLeft: '10px'
      }
    }
  }
})

const AccountStatistics = ({ language, currency, amount, establishConnection, reference }) => {
  const classes = useStyles()

  return (
    <ul className={classes.accountStatisticsContainer}>
      <li><FormattedMessage {...messages.remark} />: <span>{!establishConnection ? <div className='loading' /> : reference}</span></li>
      <li>*<FormattedMessage {...messages.important.remarks} /></li>
    </ul>
  )
}

export default AccountStatistics
