import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Statistic, Alert, Progress, Button } from 'antd';
import DepositForm from './DepositForm';
import OTPForm from './OTPForm';
import {
  TransferSuccessful,
  TransferFailed,
} from '../../components/TransferResult';
import { sendTopUpRequest, sendTopUpOtp } from './Requests';
import * as signalR from '@microsoft/signalr';
import { useQuery } from '../../utils/utils';
import { useIntl } from 'react-intl';
import messages from './messages';
import StepsBar from '../../components/StepsBar';
import ConfirmationModal from '../../components/ConfirmationModal';

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const API_USER_COMMAND_MONITOR = ENDPOINT + '/hubs/monitor';

const { Countdown } = Statistic;

const TopUp = props => {
  const [step, setStep] = useState(0);
  const [otpReference, setOtpReference] = useState();
  const [waitingForReady, setWaitingForReady] = useState(true);
  const [error, setError] = useState();
  const [progress, setProgress] = useState();
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [transferResult, setTransferResult] = useState({});
  const [deadline, setDeadline] = useState();
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.outerWidth
  });
  const queryParams = useQuery();
  const merchant = queryParams.get('m');
  const currency = queryParams.get('c1');
  const requester = queryParams.get('c2');
  const clientIp = queryParams.get('c3');
  const amount = queryParams.get('a');
  const reference = queryParams.get('r');
  const datetime = queryParams.get('d');
  const signature = queryParams.get('k');
  const session = `TOPUP-BANK-${merchant}-${reference}`;
  const intl = useIntl();
  const initProgress = {
    currentStep: 1,
    totalSteps: 10,
    statusCode: '009',
    statusMessage: intl.formatMessage(messages.progress.inProgress),
  };
  const [hasFieldError, setHasFieldError] = useState(false);
  const refFormSubmit = useRef(null);

  async function handleSubmitDeposit(values) {
    setError(undefined);
    setProgress(undefined);
    setWaitingForReady(true);
    const result = await sendTopUpRequest({
      ...values,
      reference: reference,
    });
    if (result.error) {
      setWaitingForReady(false);
      setError(result.error);
    } else {
      setProgress(initProgress);
    }
  }

  async function handleSubmitOTP(value) {
    setError(undefined);
    setProgress(undefined);
    setWaitingForReady(true);
    const result = await sendTopUpOtp(reference, value);
    if (result.errors) {
      setError(result.error);
      setProgress(undefined);
      setWaitingForReady(false);
    } else {
      setStep(1);
    }
  }

  const handleCommandStatusUpdate = useCallback(
    (e) => {
        setIsSuccessful(e.isSuccess);
        setProgress(undefined);
        setTransferResult(e);
        setWaitingForReady(false);
        setStep(2);
    },
    [],
  );

  const handleRequestOTP = useCallback(
    (e) => {
      setProgress(undefined);
      setStep(1);
      setOtpReference(e.extraData);
      setWaitingForReady(false);
    },
    [],
  );

  const handleUpdateProgress = useCallback(
    (e) => {
      setProgress(e);
    },
    [],
  );

  function handleRefFormSubmit (type) {
    refFormSubmit.current.props.onSubmit(type);
  }

  function handleHasFieldError (hasError) {
    setHasFieldError(hasError);
  }

  function handleWindowResize () {
    setWindowDimensions({
      width: window.outerWidth
    });
  }

  useEffect(() => {
    if (queryParams.toString().split('&').length < 8) {
      return props.history.replace('/invalid');
    }

    window.addEventListener('resize', handleWindowResize);

    return () => window.removeEventListener('resize', handleWindowResize);

    // disabling the react hooks recommended rule on this case because it forces to add queryparams and props.history as dependencies array
    // although dep array only needed on first load and would cause multiple rerendering if enforce as dep array. So for this case only will disable it to
    // avoid unnecessary warning
  }, [])    // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(API_USER_COMMAND_MONITOR)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.on('receivedResult', handleCommandStatusUpdate);
    connection.on('otpRequested', handleRequestOTP);
    connection.on('update', handleUpdateProgress);
    connection.onreconnected(async e => {
      await connection.invoke('Start', session);
    });

    async function start() {
      try {
        await connection.start();
        await connection.invoke('Start', session);
      } catch (ex) {
        setError({
          code: intl.formatMessage(messages.errors.networkErrorTitle),
          message: intl.formatMessage(messages.errors.networkError),
        });
      }
      setWaitingForReady(false);
    }

    start();

    return () => {
      connection.onclose(() => {
        setWaitingForReady(true);
        setError({
          code: intl.formatMessage(messages.errors.networkErrorTitle),
          message: intl.formatMessage(messages.errors.connectionError),
        });
        setProgress(undefined);
      });
    };
  }, [session, handleCommandStatusUpdate, handleRequestOTP, handleUpdateProgress, intl]);

  useEffect(() => {
    window.onbeforeunload = (e) => {
      if (step < 2) {
        // this custom message will only appear on earlier version of different browsers.
        // However on modern and latest browsers their own default message will override this custom message.
        // as of the moment only applicable on browsers. there's no definite implementation on mobile
        e.returnValue = 'Do you really want to leave current page?'
      } else {
        return;
      }
    };

    if (step === 1) {
      setDeadline(Date.now() + 1000 * 180);
    }
  }, [step]);

  let content;

  if (step === 0) {
    content = (
      <DepositForm
        merchant={merchant}
        requester={requester}
        currency={currency}
        amount={amount}
        reference={reference}
        clientIp={clientIp}
        signature={signature}
        datetime={datetime}
        handleSubmit={handleSubmitDeposit}
        refFormSubmit={refFormSubmit}
        handleHasFieldError={handleHasFieldError}
        waitingForReady={waitingForReady}
        hasFieldError={hasFieldError}
        handleRefFormSubmit={handleRefFormSubmit}
        windowDimensions={windowDimensions}
      />
    );
  } else if (step === 1) {
    content = (
      <OTPForm
        otpReference={otpReference}
        handleSubmit={handleSubmitOTP}
        waitingForReady={waitingForReady}
      />
    );
  } else if (step === 2 && isSuccessful) {
    content = (
      <main>
        <TransferSuccessful transferResult={transferResult} language='en-US' />
      </main>
    );
  } else if (step === 2) {
    content = (
      <main>
        <TransferFailed transferResult={transferResult} />
      </main>
    );
  }

  return (
    <div className='wrapper bg-top-up'>
      <div className='container'>
        <div className='form-content'>
          <header className={step === 2 ? null : 'header-bottom-border'}>
            <section className='logo'>
              <img alt='GameWallet' src={require('../../assets/banks/GW_LOGO.svg')} />
            </section>
            {
              step === 0 &&
              <Statistic
                title={intl.formatMessage(messages.deposit)}
                prefix={currency}
                value={amount}
                valueStyle={{ color: '#3F3F3F', fontWeight: 700 }}
                precision={2}
              />
            }
            {
              step === 1 &&
              <Countdown title={intl.formatMessage(messages.countdown)} value={deadline} />
            }
            {
              error &&
              <Alert
                description={error.message}
                type='error'
                showIcon
                closable
                className='error-message'
              />
            }
          </header>
          {
            content
          }
        </div>
        <StepsBar step={step} />
      </div>
      {
        (windowDimensions.width <= 576 && step === 0) &&
        <footer className='footer-submit-container'>
          <div className='deposit-submit-top-up-buttons'>
            <Button size='large' onClick={() => handleRefFormSubmit('sms')} disabled={hasFieldError} loading={waitingForReady}>
              SMS OTP
            </Button>
            <Button size='large' onClick={() => handleRefFormSubmit('smart')} disabled={hasFieldError} loading={waitingForReady}>
              SMART OTP
            </Button>
          </div>  
        </footer>
      }
        <ConfirmationModal visible={progress && (progress.statusCode === '009')}>
              <div className='progress-bar-container'>
                {
                  (progress && (progress.currentStep / progress.totalSteps) * 100) >= 60
                    ?
                      <img alt='submit-transaction' width='100' src={require('../../assets/icons/submit-success.svg')} />
                    :
                      <Progress
                        percent={progress && (progress.currentStep / progress.totalSteps) * 100}
                        status='active'
                        showInfo={false}
                        strokeColor='#34A220'
                      />
                }
                <p>{progress && progress.statusMessage}</p>
              </div>
        </ConfirmationModal>      
    </div>
  );
};

export default TopUp;
