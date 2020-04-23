import React, { useState, useEffect, useCallback } from 'react';
import ScratchCardForm from './ScratchCardForm';
import { useQuery, sleep } from '../../utils/utils';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';
import AutoRedirect from "../../components/AutoRedirect";
import {
    TransferSuccessful,
    TransferFailed,
    TransferWaitForConfirm,
  } from "../../components/TransferResult";
import { useIntl } from 'react-intl';
import messages from './messages';
import Logo from '../../components/Logo';
import StepsBar from '../../components/StepsBar';
import { checkBankIfKnown } from '../../utils/banks';
import Statistics from '../../components/Statistics';
import styled from 'styled-components';
import ErrorAlert from '../../components/ErrorAlert';
import ProgressModal from '../../components/ProgressModal';

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const API_USER_COMMAND_MONITOR = ENDPOINT + '/hubs/monitor';

const WrapperBG = styled.div`
  background-image: linear-gradient(190deg, ${props => props.theme.colors[`${props.color}`]} 44%, #FFFFFF calc(44% + 2px));
`;

const ScratchCard = (props) => {
    const [step, setStep] = useState(0);
    const [waitingForReady, setWaitingForReady] = useState(false);
    const [establishConnection, setEstablishConnection] = useState(false);
    const [error, setError] = useState(undefined);
    const [progress, setProgress] = useState(undefined);
    const [transferResult, setTransferResult] = useState({});
    const [isSuccessful, setIsSuccessful] = useState(undefined);
    const intl = useIntl();
    const steps = [intl.formatMessage(messages.steps.fillInForm), intl.formatMessage(messages.steps.result)];
    const queryParams = useQuery();
    const session = `DEPOSIT-SCRATCHCARD-${queryParams.get('m')}-${queryParams.get('r')}`;
    const isBankKnown = checkBankIfKnown(queryParams.get('c1'), queryParams.get('b'));
    const themeColor = isBankKnown ? `${queryParams.get('b').toLowerCase()}` : 'main';

    async function handleSubmitScratchCard (values) {
        const submitValues = {
            Telecom: values.telcoName,
            Pin: values.cardPin.toString(),
            SerialNumber: values.cardSerialNumber.toString(),
            ClientIp: queryParams.get('c3'),
            Language: queryParams.get('l'),
            SuccessfulUrl: queryParams.get('su'),
            FailedUrl: queryParams.get('fu'),
            CallbackUri: queryParams.get('c4'),
            Datetime: queryParams.get('d'),
            Key: queryParams.get('k'),
            Note: queryParams.get('n'),
            Merchant: queryParams.get('m'),
            Currency: queryParams.get('c1'),
            Bank: queryParams.get('b'),
            Customer: queryParams.get('c2'),
            Reference: queryParams.get('r'),
            Amount: queryParams.get('a')
        };

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
            currentStep: 3,
            totalSteps: 5,
            statusCode: '009',
            statusMessage: intl.formatMessage(messages.progress.beginningTransaction),
        });
        await sleep(750);
        setProgress({
            currentStep: 4,
            totalSteps: 5,
            statusCode: '009',
            statusMessage: intl.formatMessage(messages.progress.submittingTransaction)
        });
        await sleep(750);

        try {
            const response = await axios({
                url: 'api/ScratchCard/Deposit',
                method: 'POST',
                data: submitValues
            });
            if (response.data.statusCode === '001') {
                setProgress({
                    currentStep: 5,
                    totalSteps: 5,
                    statusCode: '009',
                    statusMessage: intl.formatMessage(messages.progress.waitingTransaction)
                    });
                await sleep(750);
                setProgress(undefined);
                setWaitingForReady(false);
                setIsSuccessful(false);
                setError({
                    message: response.data.statusMessage
                });
            }
            } catch (error) {
                setWaitingForReady(false);
                setProgress(undefined);
                setError(error);
            }
    }    
    
    function renderStepsContent (currentStep) {
        switch (currentStep) {
            case intl.formatMessage(messages.steps.fillInForm):
                return (
                    <ScratchCardForm
                        handleSubmitScratchCard={handleSubmitScratchCard}
                        waitingForReady={waitingForReady}
                        establishConnection={establishConnection}
                        bank={queryParams.get('b')}
                        currency={queryParams.get('c1')}
                    />
                );

            case intl.formatMessage(messages.steps.result):
                if (isSuccessful) {
                    return (
                        <AutoRedirect delay={10000} url={queryParams.get('su')}>
                            <TransferSuccessful transferResult={transferResult} />
                        </AutoRedirect>
                    );
                } else if (transferResult.statusCode === '009') {
                    return (
                        <AutoRedirect delay={10000} url={queryParams.get('su')}>
                            <TransferWaitForConfirm transferResult={transferResult} />
                        </AutoRedirect>
                    );
                } else {
                    return (
                        <AutoRedirect delay={10000} url={queryParams.get('fu')}>
                            <TransferFailed transferResult={transferResult} />
                        </AutoRedirect>
                    );
                }
        
            default:
                return;
        }
    }

    const handleCommandStatusUpdate = useCallback(
        async (result) => {
            let start, end;

            start = performance.now();

            if (result.statusCode === '009') {
                setProgress({
                    currentStep: 5,
                    totalSteps: 5,
                    statusCode: result.statusCode,
                    statusMessage: intl.formatMessage(messages.progress.waitingTransaction)
                });
                setWaitingForReady(true);
                setStep(0);
                await sleep(180000);
                await new Promise(resolve => resolve(end = performance.now()));
                const time = (end - start);
    
                if (time >= 180000) {
                    setProgress(undefined);
                    setWaitingForReady(false);
                    setIsSuccessful(false);
                    setTransferResult({
                        ...result,
                        message: intl.formatMessage(messages.errors.connectionTimeout)
                    });
                    setStep(1);

                    return;
                }
            } else if (result.statusCode === '006') {
                setProgress(undefined);
                setWaitingForReady(false);
                setIsSuccessful(true);
                setTransferResult(result);
                setStep(1);
                
                return;
            } else {
                setProgress(undefined);
                setWaitingForReady(false);
                setIsSuccessful(false);
                setTransferResult(result);
                setStep(1);

                return;
            }
        },
        [intl],
    );

    useEffect(() => {
        if (queryParams.toString().split('&').length < 14) {
          return props.history.replace('/invalid');
        }
    
        // disabling the react hooks recommended rule on this case because it forces to add queryparams and props.history as dependencies array
        // although dep array only needed on first load and would cause multiple rerendering if enforce as dep array. So for this case only will disable it to
        // avoid unnecessary warning
      }, [])    // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
        .withUrl(API_USER_COMMAND_MONITOR, {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

        connection.on('receivedResult', handleCommandStatusUpdate);
        connection.onreconnected(async e => {
            await connection.invoke("Start", session);
        });

        async function start() {
            try {
              await connection.start();
              await connection.invoke('Start', session);
            } catch (ex) {
              setError({
                error: {
                    name: intl.formatMessage(messages.errors.networkErrorTitle),
                    message: intl.formatMessage(messages.errors.networkError)
                  }
              });
            }
            setEstablishConnection(true);
          }
      
        start();

        return () => {
            connection.onclose(() => {
                setEstablishConnection(false);
                setError({
                    error: {
                        name: intl.formatMessage(messages.errors.networkErrorTitle),
                        message: intl.formatMessage(messages.errors.connectionError)
                      }
                  });
                setProgress(undefined);
            });
        };
    }, [session, handleCommandStatusUpdate, intl]);

    useEffect(() => {
        window.onbeforeunload = window.onunload = (e) => {
          if (step === 0) {
            // this custom message will only appear on earlier version of different browsers.
            // However on modern and latest browsers their own default message will override this custom message.
            // as of the moment only applicable on browsers. there's no definite implementation on mobile
            e.returnValue = 'Do you really want to leave current page?'
          } else {
            return;
          }
        };
      }, [step]);

    return (
        <WrapperBG className='wrapper' color={themeColor}>
            <div className='container'>
                <div className='form-content'>
                    <header className={step === 1 ? null : 'header-bottom-border'}>
                        <Logo bank='PRECARD' type='scratch-card' currency={queryParams.get('c1')} />
                        {
                            step === 0 &&
                            <Statistics
                                title={intl.formatMessage(messages.deposit)}
                                language={queryParams.get('l')}
                                currency={queryParams.get('c1')}
                                amount={queryParams.get('a')}
                            />
                        }
                        {
                            error &&
                            <ErrorAlert
                                message={error.message}
                            />
                        }
                    </header>
                    {
                        renderStepsContent(steps[step])
                    }
                </div>
                <StepsBar step={step === 1 ? 2 : step} />
            </div>
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
}

export default ScratchCard;
