import React from 'react'
import styled from 'styled-components'
import { CircularProgress } from '@rmwc/circular-progress'
import '@rmwc/circular-progress/circular-progress.css'

const StyledLoadingContainer = styled.div`
  text-align: center;
`
const StyledLoadingIcon = styled(CircularProgress)`
  && {
    color: ${props => props.theme.colors[props.color.toLowerCase()]};
  }
`

const LoadingIcon = (props) => {
  return (
    <StyledLoadingContainer>
      <StyledLoadingIcon {...props} />
    </StyledLoadingContainer>
  )
}

export default LoadingIcon
