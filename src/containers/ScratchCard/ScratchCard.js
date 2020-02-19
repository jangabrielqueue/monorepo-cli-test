import React, { useState, useEffect } from 'react';
import { Card, Steps, Spin, Alert, Progress } from 'antd';
import ScratchCardForm from './ScratchCardForm';
import { useQuery, sleep } from '../../utils/utils';
import * as signalR from '@microsoft/signalr';
import './styles.scss';
import axios from 'axios';
import AutoRedirect from "../../components/AutoRedirect";
import {
    TransferSuccessful,
    TransferFailed,
    TransferWaitForConfirm,
  } from "../../components/TransferResult";
import { useIntl } from 'react-intl';
import messages from './messages';
  
const { Step } = Steps;

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const API_USER_COMMAND_MONITOR = ENDPOINT + '/hubs/monitor';

const ScratchCard = (props) => {
    const [step, setStep] = useState(0);
    const [waitingForReady, setWaitingForReady] = useState(true);
    const [error, setError] = useState(undefined);
    const [progress, setProgress] = useState(undefined);
    const [transferResult, setTransferResult] = useState({});
    const [isSuccessful, setIsSuccessful] = useState(undefined);
    const intl = useIntl();
    const steps = [intl.formatMessage(messages.steps.fillInForm), intl.formatMessage(messages.steps.result)];
    const queryParams = useQuery();
    const session = `DEPOSIT-SCRATCHCARD-${queryParams.get('m')}-${queryParams.get('r')}`;
    const initProgress = {
        percent: 33.5,
        statusCode: '009',
        statusMessage: intl.formatMessage(messages.progress.inProgress),
    };

    function handleSubmitScratchCard (e, validateFieldsAndScroll) {
        e.preventDefault();

        validateFieldsAndScroll(async (err, values) => {
            if (!err) {
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

                await setWaitingForReady(true);
                await setProgress(initProgress);
                
                try {
                    await axios({
                      url: 'api/ScratchCard/Deposit',
                      method: 'POST',
                      data: submitValues,
                      timeout: 5000
                    });
                  } catch (error) {
                    await setWaitingForReady(false);
                    await setProgress(undefined);
                    await setError(error);
                  }
            }
        });
    }    
    
    function renderStepsContent (currentStep) {
        switch (currentStep) {
            case intl.formatMessage(messages.steps.fillInForm):
                return (
                    <ScratchCardForm
                        handleSubmitScratchCard={handleSubmitScratchCard}
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

    function showProgress (progress) {
        function progressStatus () {
            if (progress.percent !== 100) {
                return 'active';
            } else if (progress.percent === 100 && !isSuccessful) {
                return 'exception';
            } else if (progress.percent === 100 && isSuccessful) {
                return 'success';
            }
        }

        return (
            <div style={{ padding: '5px' }}>
                <Progress
                    percent={progress.percent}
                    status={progressStatus()}
                    showInfo={false}
                />
                <strong>{progress.statusMessage}</strong>
            </div>            
        );
    };

    async function handleCommandStatusUpdate (result) {
        let start, end;

        start = performance.now();
        
        if (result.statusCode === '009') {
            setProgress({
                percent: 67,
                statusMessage: intl.formatMessage(messages.progress.waitingForProvider),
              });
            setWaitingForReady(true);
            setStep(0);
            await sleep(180000);
            await new Promise(resolve => resolve(end = performance.now()));
            const time = (end - start);

            if (time >= 180000) {
                setProgress({
                    percent: 67,
                    statusMessage: intl.formatMessage(messages.progress.waitingForProvider),
                  });
                setWaitingForReady(false);
                setIsSuccessful(false);
                setTransferResult({
                    ...result,
                    message: intl.formatMessage(messages.errors.connectionTimeout)
                });
                setStep(1);
            }
        } else if (result.statusCode === '006') {
            setProgress({
                percent: 100,
                statusMessage: intl.formatMessage(messages.progress.transactionComplete),
              });
            setWaitingForReady(false);
            setIsSuccessful(true);
            setTransferResult(result);
            setStep(1);
        } else {
            setProgress({
                percent: 100,
                statusMessage: intl.formatMessage(messages.progress.transactionComplete),
              });
            setWaitingForReady(false);
            setIsSuccessful(false);
            setTransferResult(result);
            setStep(1);
        }
      };

    useEffect(() => {
        if (!props.location.search) {
            props.history.replace('/invalid');
        }

        const connection = new signalR.HubConnectionBuilder()
        .withUrl(API_USER_COMMAND_MONITOR)
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
              setWaitingForReady(false);
            } catch (ex) {
              setWaitingForReady(true);
              setError({
                error: {
                    name: intl.formatMessage(messages.errors.networkErrorTitle),
                    message: intl.formatMessage(messages.errors.networkError)
                  }
              });
            }
          }
      
        start();

        return () => {
            connection.onclose(() => {
                setWaitingForReady(true);
                setError({
                    error: {
                        name: intl.formatMessage(messages.errors.networkErrorTitle),
                        message: intl.formatMessage(messages.errors.connectionError)
                      }
                  });
                setProgress(undefined);
            });
        };
    }, [session]);

    return (
        <>
            <div className='steps-container'>  
                <Steps current={step} size='small'>
                    {
                        steps.map((item, i) => (
                            <Step key={i} title={item} />
                        ))
                    }
                </Steps>
            </div>
            <div className='deposit-container'>
            {
                error &&
                    <Alert
                        message={error.name}
                        description={error.message}
                        type='error'
                        showIcon
                        style={{ marginBottom: '0.5rem' }}
                    />
            }
            <Spin spinning={waitingForReady}>
                <Card>
                    {
                        renderStepsContent(steps[step])
                    }
                </Card>
            </Spin>
                {
                    progress && showProgress(progress)
                }
            </div>
        </>
    );
}

export default ScratchCard;
