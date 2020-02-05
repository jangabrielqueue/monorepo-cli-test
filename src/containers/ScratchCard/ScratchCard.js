import React, { useState, useEffect } from 'react';
import { Card, Steps, Spin, Alert, Progress } from 'antd';
import ScratchCardForm from './ScratchCardForm';
import ScratchCardResult from './ScratchCardResult';
import { useQuery } from '../../utils/utils';
import * as signalR from '@microsoft/signalr';
import './styles.scss';
import axios from 'axios';

const { Step } = Steps;

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const API_USER_COMMAND_MONITOR = ENDPOINT + '/hubs/monitor';

const initProgress = {
    percent: 33.5,
    statusCode: '009',
    statusMessage: 'Waiting For Response',
  };

const ScratchCard = (props) => {
    const [step, setStep] = useState(0);
    const [waitingForReady, setWaitingForReady] = useState(true);
    const [error, setError] = useState(undefined);
    const [progress, setProgress] = useState(undefined);
    const [transferResult, setTransferResult] = useState({});
    const [isSuccessful, setIsSuccessful] = useState(undefined);
    
    const steps = ['FILL IN FORM', 'RESULT'];
    const queryParams = useQuery();
    const session = `DEPOSIT-SCRATCHCARD-${queryParams.get('merchant')}-${queryParams.get('reference')}`;

    function handleSubmitScratchCard (e, validateFieldsAndScroll) {
        e.preventDefault();

        validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                const submitValues = {
                    Telecom: values.telcoName,
                    Pin: values.cardPin.toString(),
                    SerialNumber: values.cardSerialNumber.toString(),
                    ClientIp: queryParams.get('clientIp'),
                    Language: queryParams.get('language'),
                    SuccessfulUrl: queryParams.get('successfulUrl'),
                    FailedUrl: queryParams.get('failedUrl'),
                    CallbackUri: queryParams.get('callbackUri'),
                    Datetime: queryParams.get('datetime'),
                    Key: queryParams.get('key'),
                    Note: queryParams.get('note'),
                    Merchant: queryParams.get('merchant'),
                    Currency: queryParams.get('currency'),
                    Bank: queryParams.get('bank'),
                    Customer: queryParams.get('customer'),
                    Reference: queryParams.get('reference'),
                    Amount: queryParams.get('amount')
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
            case 'FILL IN FORM':
                return (
                    <ScratchCardForm
                        handleSubmitScratchCard={handleSubmitScratchCard}
                    />
                );

            case 'RESULT':
                return (
                    <ScratchCardResult
                        isSuccessful={isSuccessful}
                        transferResult={transferResult}
                        successfulUrl={queryParams.get('successfulUrl')}
                        failedUrl={queryParams.get('failedUrl')}
                    />
                );
        
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
                statusMessage: 'Confirming transaction',
              });
            setWaitingForReady(true);
            setStep(0);
            await new Promise(resolve => setTimeout(resolve, 180000));
            await new Promise(resolve => resolve(end = performance.now()));
            const time = (end - start);

            if (time >= 180000) {
                setProgress({
                    percent: 100,
                    statusMessage: 'Transaction Complete',
                  });
                setWaitingForReady(false);
                setIsSuccessful(false);
                setTransferResult({
                    statusMessage: 'A server connection timeout error, please contact customer support for the transaction status.'
                });
                setStep(1);
            }
        } else if (result.statusCode === '006') {
            setProgress({
                percent: 100,
                statusMessage: 'Transaction Complete',
              });
            setWaitingForReady(false);
            setIsSuccessful(true);
            setTransferResult(result);
            setStep(1);
        } else {
            setProgress({
                percent: 100,
                statusMessage: 'Transaction Complete',
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

        async function start() {
            try {
              await connection.start();
              await connection.invoke('Start', session);
              setWaitingForReady(false);
            } catch (ex) {
              setWaitingForReady(true);
              setError({
                error: {
                    name: 'Network error',
                    message: 'Can\'t connect to server, please refresh your browser.'
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
                        name: 'Network error',
                        message: 'Connection is closed, please refresh the page.'
                      }
                  });
                setProgress(undefined);
            });
        };
    }, []);

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
