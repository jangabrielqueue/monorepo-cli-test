import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, Progress } from 'antd';
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
import { useQuery, sleep } from '../../utils/utils';
import { useIntl } from 'react-intl';
import messages from './messages';
import Logo from '../../components/Logo';
import StepsBar from '../../components/StepsBar';
import ConfirmationModal from '../../components/ConfirmationModal';
import { checkBankIfKnown } from '../../utils/banks';
import GlobalButton from '../../components/GlobalButton';
import styled from 'styled-components';
import Statistics from '../../components/Statistics';
import Countdown from '../../components/Countdown';
import ErrorAlert from '../../components/ErrorAlert';
import ProgressModal from '../../components/ProgressModal';

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const API_USER_COMMAND_MONITOR = ENDPOINT + '/hubs/monitor';

const WrapperBG = styled.div`
  background-image: linear-gradient(190deg, ${props => props.theme.colors[`${props.color}`]} 44%, #FFFFFF calc(44% + 2px));
`;

const Deposit = props => {
  const analytics = firebase.analytics();
  const [step, setStep] = useState(0);
  const [otpReference, setOtpReference] = useState();
  const [waitingForReady, setWaitingForReady] = useState(false);
  const [establishConnection, setEstablishConnection] = useState(false);
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
  const [hasFieldError, setHasFieldError] = useState(false);
  const refFormSubmit = useRef(null);
  const showOtpMethod = currency === 'VND';
  analytics.setCurrentScreen('deposit');
  const isBankKnown = checkBankIfKnown(currency, bank);
  const themeColor = isBankKnown ? `${bank.toLowerCase()}` : 'main';
  const renderIcon = isBankKnown ? `${bank.toLowerCase()}`: 'unknown';

  async function handleSubmitDeposit(values) {
    analytics.logEvent('login', {
      reference,
    });
    setError(undefined);
    setWaitingForReady(true);
    setProgress({
      currentStep: 1,
      totalSteps: 5,
      statusCode: '009',
      statusMessage: intl.formatMessage(messages.progress.startingConnection),
    });
    await sleep(750);
    setProgress({
      currentStep: 2,
      totalSteps: 5,
      statusCode: '009',
      statusMessage: intl.formatMessage(messages.progress.encryptedTransmission),
    });
    await sleep(750);
    setProgress({
      currentStep: 3.5,
      totalSteps: 5,
      statusCode: '009',
      statusMessage: intl.formatMessage(messages.progress.beginningTransaction)
    });
    await sleep(750);
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
      setProgress({
        currentStep: 4,
        totalSteps: 5,
        statusCode: '009',
        statusMessage: intl.formatMessage(messages.progress.submittingTransaction)
      });
      await sleep(750);
      setProgress({
        currentStep: 5,
        totalSteps: 5,
        statusCode: '009',
        statusMessage: intl.formatMessage(messages.progress.waitingTransaction)
      });
      await sleep(750);
      setProgress(undefined);
      setWaitingForReady(false);
      setError(result.error);
    }
  }

  async function handleSubmitOTP(value) {
    analytics.logEvent('submitted_otp', {
      reference: reference,
      otp: value,
    });
    setError(undefined);
    setWaitingForReady(true);
    const result = await sendDepositOtp(reference, value);
    if (result.error) {
      analytics.logEvent('submitted_otp_failed', {
        reference: reference,
        otp: value,
      });
      setError(result.error);
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
    async (e) => {
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
    async (e) => {
      setProgress(undefined);
      setStep(1);
      setOtpReference(e.extraData);
      setWaitingForReady(false);
      setDeadline(Date.now() + 1000 * 180);
    },
    [],
  );

  const handleUpdateProgress = useCallback(
    async (e) => {
      if ((e.currentStep + 2) === (e.totalSteps + 2)) {
        setProgress({
          currentStep: 5,
          totalSteps: 5,
          statusCode: e.statusCode,
          statusMessage: intl.formatMessage(messages.progress.waitingTransaction)
        });
      } else if ((e.currentStep + 2) >= 3) {
        setProgress({
          currentStep: 5,
          totalSteps: 5,
          statusCode: e.statusCode,
          statusMessage: intl.formatMessage(messages.progress.submittingTransaction)
        });
      }
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
      setEstablishConnection(true);
    }

    start();

    return () => {
      connection.onclose(() => {
        setEstablishConnection(false);
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
        establishConnection={establishConnection}
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
        progress={progress}
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
    <WrapperBG className='wrapper' color={themeColor}>
      <div className='container'>
        <div className='form-content'>
          <header className={step === 2 ? null : 'header-bottom-border'}>
            <Logo bank={bank.toUpperCase()} currency={currency} />
            {
              step === 0 &&
              <Statistics
                title={intl.formatMessage(messages.deposit)}
                language={language}
                currency={currency}
                amount={amount}
              />
            }
            {
              step === 1 &&
              <Countdown />
            }
            {
              error &&
              <ErrorAlert
                message={error.message}
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
              {/* <Button className={buttonBG} size='large' onClick={() => handleRefFormSubmit('sms')} disabled={hasFieldError || !establishConnection} loading={waitingForReady}>
                {
                  !waitingForReady &&
                  <img alt='sms' src={require(`../../assets/icons/${renderIcon}/sms-${renderIcon}.svg`)} />
                }
                SMS OTP
              </Button>
              <Button className={buttonBG} size='large' onClick={() => handleRefFormSubmit('smart')} disabled={hasFieldError || !establishConnection} loading={waitingForReady}>
                {
                  !waitingForReady &&
                  <img alt='smart' src={require(`../../assets/icons/${renderIcon}/smart-${renderIcon}.svg`)} />
                }
                SMART OTP
              </Button> */}
              <GlobalButton
                label='SMS OTP'
                color={themeColor}
                outlined
                icon={<img alt='sms' src={require(`../../assets/icons/${renderIcon}/sms-${renderIcon}.svg`)} />}
                onClick={() => undefined}
                disabled={!establishConnection || waitingForReady}
              />
              <GlobalButton
                label='SMART OTP'
                color={themeColor} 
                outlined
                icon={<img alt='smart' src={require(`../../assets/icons/${renderIcon}/smart-${renderIcon}.svg`)} />}
                onClick={() => undefined}
                disabled={!establishConnection || waitingForReady}
              />
            </div>  
          </footer>
        }
        <ProgressModal open={progress && (progress.statusCode === '009')}>
          <div className='progress-bar-container'>
            <img alt='submit-transaction' width='80' src={require('../../assets/icons/in-progress.svg')} />
            <progress
              value={progress && (progress.currentStep / progress.totalSteps) * 100}
              max={100}
            />
            <p>{progress && progress.statusMessage}</p>
          </div>
        </ProgressModal>
    </WrapperBG>
  );
};

export default Deposit;
