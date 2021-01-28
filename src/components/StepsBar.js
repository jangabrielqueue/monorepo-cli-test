import React from 'react'
import styled from 'styled-components'

// styling
const StyledStepBarContainer = styled.section`
  padding: 15px 0;
  text-align: center;
`

const StepsBar = ({ step }) => {
  return (
    <StyledStepBarContainer>
      <img alt='steps' width='76' height='10' src={require(`../assets/icons/steps-${step}.png`)} />
    </StyledStepBarContainer>
  )
}

export default StepsBar
