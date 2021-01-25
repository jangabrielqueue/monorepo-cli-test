import React from 'react'
import { Button } from '@rmwc/button'
import styled from 'styled-components'
import { renderButtonColors } from '../utils/utils'
import '@material/button/dist/mdc.button.css'
import '@rmwc/icon/icon.css'
import '@material/ripple/dist/mdc.ripple.css'

const OutlinedButton = styled(Button)`
  && {
    background-color: ${props => props.topup === 'true' ? props.theme.colors[props.color.toLowerCase()] + '!important' : 'transparent'};
    border-radius: 8px;
    border: ${props => props.topup === 'true' ? '0' : '2px solid' + props.theme.colors[props.color.toLowerCase()] + '!important'};
    color: ${props => props.topup === 'true' ? '#FFF !important' : props.theme.colors[props.color.toLowerCase()] + '!important'};
    font-family: ProductSansBold;
    height: 43px;
    line-height: 0.5;
    margin: 10px;
    max-width: 155px;
    width: 100%;

    i {
      height: auto;
      width: auto;
    }

    &:disabled {
        opacity: 0.5;
    }

    @media (max-width: 23.438em) {
        max-width: 130px;
        padding: 0;
    }
  }
`

const DefaultButton = styled(Button)`
  && {
    background-color: ${props => props.theme.colors[`${renderButtonColors(props.bank, props.color)}`]} !important;
    border-radius: 11px;
    border: 0;
    color: #fff !important;
    font-family: ProductSansMedium;
    font-size: 18px;
    height: 50px;
    padding: 0 20px;
    position: relative;
    text-transform: capitalize;
    width: 100%;

    &:disabled {
        opacity: 0.5;
    }

    > i {
        left: 20px;
        position: absolute;
        top: 13px;
    }
  }
`

const GlobalButton = (props) => {
  return (
    <>
      {
        props.outlined ? <OutlinedButton {...props} /> : <DefaultButton {...props} />
      }
    </>
  )
}

export default GlobalButton
