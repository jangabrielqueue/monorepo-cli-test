import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Statistic, Alert, Progress, Button } from 'antd';
import * as firebase from 'firebase/app';
import AutoRedirect from '../../components/AutoRedirect';
import DepositForm from './DepositForm';
import OTPForm from './OTPForm';
import {
  TransferSuccessful,
  TransferFailed,
  TransferWaitForConfirm,
} from '../../components/TransferResult';
import { sendDepositRequest, sendDepositOtp } from './Requests';
import * as signalR from '@microsoft/signalr';
import { useQuery } from '../../utils/utils';
import { useIntl } from 'react-intl';
import messages from './messages';
import Logo from '../../components/Logo';
import StepsBar from '../../components/StepsBar';
import ConfirmationModal from '../../components/ConfirmationModal';
import { checkBankIfKnown } from '../../utils/banks';

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const API_USER_COMMAND_MONITOR = ENDPOINT + '/hubs/monitor';

const { Countdown } = Statistic;

const Deposit = props => {
  const analytics = firebase.analytics();
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
  const bank = queryParams.get('b');
  const merchant = queryParams.get('m');
  const currency = queryParams.get('c1');
  const requester = queryParams.get('c2');
  const clientIp = queryParams.get('c3');
  const callbackUri = queryParams.get('c4');
  const amount = queryParams.get('a');
  const reference = queryParams.get('r');
  const datetime = queryParams.get('d');
  const signature = queryParams.get('k');
  const successfulUrl = queryParams.get('su');
  const failedUrl = queryParams.get('fu');
  const note = queryParams.get('n');
  const language = queryParams.get('l');
  const session = `DEPOSIT-BANK-${merchant}-${reference}`;
  const intl = useIntl();
  const initProgress = {
    currentStep: 1,
    totalSteps: 10,
    statusCode: '009',
    statusMessage: intl.formatMessage(messages.progress.inProgress),
  };
  const [hasFieldError, setHasFieldError] = useState(false);
  const refFormSubmit = useRef(null);
  const showOtpMethod = currency === 'VND';
  analytics.setCurrentScreen('deposit');
  const isBankKnown = checkBankIfKnown(currency, bank);
  const wrapperBG = isBankKnown ? `bg-${bank.toLowerCase()}` : 'bg-unknown';
  const buttonBG = isBankKnown ? `button-${bank.toLowerCase()}` : 'button-unknown';
  const renderIcon = isBankKnown ? `${bank.toLowerCase()}`: 'unknown';

  async function handleSubmitDeposit(values) {
    analytics.logEvent('login', {
      reference,
    });
    setError(undefined);
    setProgress(undefined);
    setWaitingForReady(true);
    const result = await sendDepositRequest({
      ...values,
      reference,
      language,
      note,
      successfulUrl,
      failedUrl,
      callbackUri,
    });
    if (result.error) {
      analytics.logEvent('login_failed', {
        reference,
        error: result.error,
      });
      setWaitingForReady(false);
      setError(result.error);
    } else {
      setProgress(initProgress);
    }
  }

  async function handleSubmitOTP(value) {
    analytics.logEvent('submitted_otp', {
      reference: reference,
      otp: value,
    });
    setError(undefined);
    setProgress(undefined);
    setWaitingForReady(true);
    const result = await sendDepositOtp(reference, value);
    if (result.error) {
      analytics.logEvent('submitted_otp_failed', {
        reference: reference,
        otp: value,
      });
      setError(result.error);
      setProgress(undefined);
      setWaitingForReady(false);
    } else {
      analytics.logEvent('submitted_otp_succeed', {
        reference: reference,
        otp: value,
      });
      setStep(1);
    }
  }

  const handleReceivedResult = useCallback(
    (e) => {
        analytics.logEvent('received_result', {
          reference: reference,
          result: e,
        });
        setIsSuccessful(e.isSuccess);
        setProgress(undefined);
        setTransferResult(e);
        setWaitingForReady(false);
        setStep(2);
    },
    [analytics, reference],
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
    if (queryParams.toString().split('&').length < 14) {
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

    connection.on('receivedResult', handleReceivedResult);
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
  }, [session, handleReceivedResult, handleRequestOTP, handleUpdateProgress, intl]);

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
    analytics.setCurrentScreen('input_user_credentials');
    content = (
      <DepositForm
        merchant={merchant}
        requester={requester}
        currency={currency}
        bank={bank}
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
        showOtpMethod={showOtpMethod}
        handleRefFormSubmit={handleRefFormSubmit}
        windowDimensions={windowDimensions}
      />
    );
  } else if (step === 1) {
    analytics.setCurrentScreen('input_otp');
    content = (
      <OTPForm
        otpReference={otpReference}
        handleSubmitOTP={handleSubmitOTP}
        waitingForReady={waitingForReady}
        bank={bank}
        currency={currency}
      />
    );
  } else if (step === 2 && isSuccessful) {
    analytics.setCurrentScreen('transfer_successful');
    content = (
      <AutoRedirect delay={10000} url={successfulUrl}>
        <TransferSuccessful transferResult={transferResult} language={language} />
      </AutoRedirect>
    );
  } else if (step === 2 && transferResult.statusCode === '000') {
    analytics.setCurrentScreen('transfer_successful');
    content = (
      <AutoRedirect delay={10000} url={successfulUrl}>
        <TransferWaitForConfirm transferResult={transferResult} />
      </AutoRedirect>
    );
  } else if (step === 2) {
    analytics.setCurrentScreen('transfer_failed');
    content = (
      <AutoRedirect delay={10000} url={failedUrl}>
        <TransferFailed transferResult={transferResult} />
      </AutoRedirect>
    );
  }

  return (
    <div className={`wrapper ${wrapperBG}`}>
      <div className='container'>
        <div className='form-content'>
          <header className={step === 2 ? null : 'header-bottom-border'}>
            <Logo bank={bank.toUpperCase()} currency={currency} />
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
          (showOtpMethod && windowDimensions.width <= 576 && step === 0) &&
          <footer className='footer-submit-container'>
            <div className='deposit-submit-buttons'>
              <Button className={buttonBG} size='large' onClick={() => handleRefFormSubmit('sms')} disabled={hasFieldError} loading={waitingForReady}>
                {
                  !waitingForReady &&
                  <img src={require(`../../assets/icons/${renderIcon}/sms-${renderIcon}.svg`)} />
                }
                SMS OTP
              </Button>
              <Button className={buttonBG} size='large' onClick={() => handleRefFormSubmit('smart')} disabled={hasFieldError} loading={waitingForReady}>
                {
                  !waitingForReady &&
                  <img src={require(`../../assets/icons/${renderIcon}/smart-${renderIcon}.svg`)} />
                }
                SMART OTP
              </Button>
            </div>  
          </footer>
        }
        <ConfirmationModal visible={progress && (progress.statusCode === '009')}>
          <div className='progress-bar-container'>
            {
              (progress && (progress.currentStep / progress.totalSteps) * 100) < 100 &&
              <img alt='submit-transaction' width='80' src={require('../../assets/icons/in-progress.svg')} />
            }
            <Progress
              percent={progress && (progress.currentStep / progress.totalSteps) * 100}
              status='active'
              showInfo={false}
              strokeColor='#34A220'
            />
            <p>{progress && progress.statusMessage}</p>
          </div>
        </ConfirmationModal>
    </div>
  );
};

export default Deposit;
