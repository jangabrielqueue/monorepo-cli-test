import React, { memo } from 'react'
import styled from 'styled-components'

// styling
const StyledFallbackContainer = styled.div`
  margin: 0 20px;
  max-width: 500px;
  width: 100%;
`
const StyledFallbackContent = styled.div`
  background: #FFFFFF;
  border-radius: 15px;
  box-shadow: 0px 5px 10px 0px rgba(112,112,112,0.3);
`
const StyledFallback = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  max-width: 500px;
  min-height: 500px;
`

const FallbackPage = () => {
  return (
    <StyledFallbackContainer>
      <StyledFallbackContent>
        <StyledFallback />
      </StyledFallbackContent>
    </StyledFallbackContainer>
  )
}

export default memo(FallbackPage)
