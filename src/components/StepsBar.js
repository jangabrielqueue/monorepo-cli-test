import React from 'react'

const StepsBar = ({ step }) => {
  return (
    <section className='steps-bar-container'>
      <img alt='steps' width='76' height='10' src={require(`../assets/icons/steps-${step}.png`)} />
    </section>
  )
}

export default StepsBar
