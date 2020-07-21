import React from "react";
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import styled from 'styled-components';

const StyledRedirectContent = styled.div`
  text-align: center;

  img {
    margin: 30px 0;
  }

  h1 {
    color: #767676;
    font-family: ProductSansMedium;
    font-size: 18px;
  }

  h2 {
    color: #767676;
    font-family: ProductSansMedium;
    font-size: 17px;
    margin: 25px 0;
  }

  p {
    color: #767676;
    font-size: 16px;
    margin: 25px 0;
  }
`;

const StyledTransactionAmount = styled.div`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.11);
  border-radius: 11px;
  color: #000000;
  display: flex;
  font-family: ProductSansMedium;
  font-size: 18px;
  height: 50px;
  justify-content: center;
  width: 100%;
`;

export const TransferSuccessful = ({ transferResult, language }) => {
  return (
    <StyledRedirectContent>
      <img alt='submit-success' src={require('../assets/icons/submit-success.svg')} />
      <h1>{<FormattedMessage {...messages.success.successfullyDeposit} />}</h1>
      <p>References: {`${transferResult.reference}`}</p>
      <StyledTransactionAmount>
        <span>
          {
            new Intl.NumberFormat(language, { style: 'currency', currency: transferResult.currency }).format(transferResult.amount)
          }
        </span>
      </StyledTransactionAmount>
    </StyledRedirectContent>
  );
};

export const TransferFailed = ({ transferResult }) => {
  return (
    <StyledRedirectContent>
      <img alt='submit-failed' src={require('../assets/icons/submit-failed.svg')} />
      <h1>{<FormattedMessage {...messages.errors.transactionFailed} />}</h1>
      <p>{transferResult.message || transferResult.statusMessage}</p>
    </StyledRedirectContent>
  );
};

export const TransferWaitForConfirm = ({ transferResult }) => {
  return (
    <StyledRedirectContent>
      <h2>{<FormattedMessage {...messages.progress.pendingConfirmation} />}</h2>
      <p>{transferResult.message || transferResult.statusMessage}</p>
    </StyledRedirectContent>
  );
};
