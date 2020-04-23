import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import messages from './messages';
import styled from 'styled-components';

const StyledCountdown = styled.section`
    > h1 {
        color: #767676;
        font-size: 16px;
        margin-bottom: ${props => props.redirect ? '10px' : '4px'};
    }

    > p {
        color: #3f3f3f;
        font-family: ProductSansBold;
        font-size: 24px;
        margin: 0;
    }
`;

const Countdown = ({ redirect, intl, delay, renderCountdownAgain }) => {
    const [minutes, setMinutes] = useState(redirect ? 0 : 3);
    const [seconds, setSeconds] = useState(redirect ? 10: 0);

    useEffect(() => {
        const timerInterval = setInterval(() => {

            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(timerInterval);
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            } 
        }, 1000);

        return () => {
            clearInterval(timerInterval);
        }
    }, [seconds, minutes, renderCountdownAgain]);

    return (
        <StyledCountdown redirect={redirect}>
            <h1>{redirect ? intl.formatMessage(messages.texts.redirected, { timeLeft: delay / 1000 }) : 'Countdown'}</h1>
            <p>00:0{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>
        </StyledCountdown>
    )
}

export default injectIntl(Countdown);
