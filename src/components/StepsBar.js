import React from 'react'

const StepsBar = ({ step }) => {
    return (
        <section className='steps-bar-container'>
            <img alt='steps' src={require(`../assets/icons/steps-${step}.svg`)} />
        </section>
    )
}

export default StepsBar;
