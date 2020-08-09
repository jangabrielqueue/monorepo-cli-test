import React, { useState } from 'react'
import styled from 'styled-components'
import rightExpand from '../assets/icons/right-expand.png'
import downExpand from '../assets/icons/down-expand.png'

const StyledPanel = styled.section`
    margin: 0 10px;
`

const StyledHeader = styled.div`
    cursor: pointer;
    font-family: ProductSansMedium;
    font-size: 14px;
    height: 31px;

    &:hover {
        opacity: 0.7;
    }

    &:before {
        background: url(${props => props.toggleCollapse ? downExpand : rightExpand}) no-repeat center;
        content: '';
        display: block;
        float: left;
        height: 20px;
        margin-right: 5px;
        width: 20px;
    }
`

const StyledContent = styled.div`
  font-size: 12px;
  overflow-y: hidden;
  max-height: ${props => props.toggleCollapse ? props.topup ? '100px' : '50px' : '0'};

  transition-property: all;
  transition-duration: .5s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
`

const CollapsiblePanel = ({ children, title, topup }) => {
  const [toggleCollapse, setToggleCollapse] = useState(false)

  function handleToggleCollapse () {
    setToggleCollapse(prevState => !prevState)
  }

  return (
    <StyledPanel>
      <StyledHeader
        onClick={handleToggleCollapse}
        toggleCollapse={toggleCollapse}
      >
        {
          title
        }
      </StyledHeader>
      <StyledContent
        topup={topup}
        toggleCollapse={toggleCollapse}
      >
        {
          children
        }
      </StyledContent>
    </StyledPanel>
  )
}

export default CollapsiblePanel
