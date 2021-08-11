import React from 'react'
import { createUseStyles } from 'react-jss'

// styling
const useStyles = createUseStyles({
  statisticsContainerHeader: {
    fontSize: '16px',
    fontWeight: '400',
    margin: '0 0 4px',

    '@media (max-width: 36em) and (orientation: portrait)': {
      fontSize: '14px'
    }
  },
  statisticsContainerText: {
    color: '#3f3f3f',
    fontFamily: 'ProductSansBold',
    fontSize: '24px',
    margin: 0,

    '@media (max-width: 36em) and (orientation: portrait)': {
      fontSize: '18px'
    }
  }
})

const Statistics = ({ title, language, currency, amount }) => {
  const classes = useStyles()

  return (
    <section>
      <h1 className={classes.statisticsContainerHeader}>{title}</h1>
      <p className={classes.statisticsContainerText}>{`${currency} ${new Intl.NumberFormat(language).format(amount)}`}</p>
    </section>
  )
}

export default Statistics
