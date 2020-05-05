import React from "react";
import { useIntl } from 'react-intl';
import messages from './messages';

let intl;

export const TransferSuccessful = ({ transferResult, language }) => {
  intl = useIntl();

  return (
    <div className='auto-redirect-content'>
      <img alt='submit-success' src={require('../assets/icons/submit-success.svg')} />
      <h1>{intl.formatMessage(messages.success.successfullyDeposit)}</h1>
      <p>References: {`${transferResult.reference}`}</p>
      <div className='transaction-amount'>
        <span>
          {
            new Intl.NumberFormat(language, { style: 'currency', currency: transferResult.currency }).format(transferResult.amount)
          }
        </span>
      </div>
    </div>
  );
};

export const TransferFailed = ({ transferResult }) => {
  intl = useIntl();

  return (
    <div className='auto-redirect-content'>
      <img alt='submit-failed' src={require('../assets/icons/submit-failed.svg')} />
      <h1>{intl.formatMessage(messages.errors.transactionFailed)}</h1>
      <p>{transferResult.message}</p>
    </div>
  );
};

export const TransferWaitForConfirm = ({ transferResult }) => {
  intl = useIntl();

  return (
    <div className='auto-redirect-content'>
      <h2>{intl.formatMessage(messages.progress.pendingConfirmation)}</h2>
      <p>{transferResult.message}</p>
    </div>
  );
};
