import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  cardContainer: {
    margin: '0 20px',
    maxWidth: '500px',
    width: '100%',
    background: '#FFFFFF',
    borderRadius: '15px',
    boxShadow: '0px 5px 10px 0px rgba(112,112,112,0.3)',
    padding: '20px'
  }
})

export const Card = ({ children }) => {
  const classes = useStyles()
  return (
    <div className={classes.cardContainer}>
      {children}
    </div>
  )
}
