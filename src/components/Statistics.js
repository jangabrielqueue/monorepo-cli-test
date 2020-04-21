import React from 'react';
import styled from 'styled-components';

const StyledStatistics = styled.section`
    > h1 {
        color: #767676;
        font-size: 16px;
        margin-bottom: 4px;
    }

    > p {
        color: #3f3f3f;
        font-family: ProductSansBold;
        font-size: 24px;
        margin: 0;
    }
`;

const Statistics = ({ title, language, currency, amount }) => {
    return (
        <StyledStatistics>
            <h1>{title}</h1>
            <p>{`${currency} ${new Intl.NumberFormat(language).format(amount)}`}</p>
        </StyledStatistics>
    )
}

export default Statistics;
