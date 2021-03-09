import React from 'react'
import { createUseStyles } from 'react-jss'

// styling
const useStyles = createUseStyles({
  stepBarContainer: {
    padding: '15px 0',
    textAlign: 'center'
  }
})

const StepsBar = ({ step }) => {
  const classes = useStyles()

  return (
    <section className={classes.stepBarContainer}>
      <img alt='steps' width='76' height='10' src={`/icons/steps-${step}.png`} />
    </section>
  )
}

export default StepsBar
