import React from 'react';
import styled from 'styled-components';

const StyledError = styled.section`
    background-color: #fff1f0;
    border-radius: 4px;
    border: 1px solid #ffa39e;
    line-height: 1.5;
    padding: 15px;

    > p {
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        line-height: 22px;
        margin: 0;
        word-break: break-all;

        > img {
            vertical-align: bottom;
            margin-right: 10px;
        }
    }
`;

const ErrorAlert = ({ message }) => {
    return (
        <StyledError>
            <p>
                <img alt='error' width='24' src={require('../assets/icons/error.png')} />
                {message}
            </p>
        </StyledError>
    )
}

export default ErrorAlert;
