import React from 'react';
import { Button } from '@rmwc/button';
import styled from 'styled-components';

const OutlinedButton = styled(Button)`
    border-radius: 8px;
    border: 2px solid ${props => props.theme.colors[`${props.color}`]} !important;
    color: ${props => props.theme.colors[`${props.color}`]} !important;
    font-family: ProductSansBold;
    height: 43px;
    margin: 15px;
    max-width: 155px;
    width: 100%;

    &:disabled {
        opacity: 0.5;
    }
`;

const DefaultButton = styled(Button)`
    background-color: ${props => props.theme.colors[`${props.color}`]} !important;
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
    }
`;

const GlobalButton = (props) => {
    return (
        <>
            {
                props.outlined ? <OutlinedButton {...props} /> : <DefaultButton {...props} />
            }
        </>
    )
}

export default GlobalButton;
