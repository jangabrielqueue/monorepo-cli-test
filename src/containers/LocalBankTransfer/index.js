import React, { useState, useEffect, useCallback, lazy, useContext, Suspense } from 'react'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { ErrorBoundary } from 'react-error-boundary'
import { FallbackComponent } from '../../components/FallbackComponent'
import { QueryParamsValidator } from '../../components/QueryParamsValidator'
import { FirebaseContext } from '../../contexts/FirebaseContext'
import { createUseStyles } from 'react-jss'
import { QueryParamsContext } from '../../contexts/QueryParamsContext'
import axios from 'axios'
import messages from './messages'
import { FormattedMessage, injectIntl } from 'react-intl'
import StepsBar from '../../components/StepsBar'
import ProgressModal from '../../components/ProgressModal'
import ErrorAlert from '../../components/ErrorAlert'
import LoadingIcon from '../../components/LoadingIcon'
import { checkBankIfKnown } from '../../utils/banks'
import { sleep } from '../../utils/utils'
import TransferSuccessful from '../../components/TransferSuccessful'
import TransferFailed from '../../components/TransferFailed'
import AutoRedirect from '../../components/AutoRedirect'
import LocalBankTransferForm from './forms/LocalBankTransferForm'

// endpoints
const ENDPOINT = process.env.REACT_APP_ENDPOINT
const API_USER_COMMAND_MONITOR = ENDPOINT + '/hubs/monitor'

// lazy loaded components
const Logo = lazy(() => import('../../components/Logo'))

// styling
const useStyles = createUseStyles({
  localBankTransferHeader: {
    padding: '10px 20px',
    borderBottom: (props) => props.step === 1 ? '#FFF' : '0.5px solid #E3E3E3'
  },
  localBankTransferBody: {
    padding: '20px',
    position: 'relative'
  },
  formWrapper: {
    height: '100%',
    minWidth: '500px',
    padding: '75px 0 0',

    '@media (max-width: 36em)': {
      minWidth: 0,
      overflowY: 'scroll',
      maxHeight: 'calc(100vh - 83px)'
    },

    '@media (max-width: 33.750em)': {
      padding: '35px 20px 0'
    }
  },
  localBankTransferContainer: {
    margin: '0 auto',
    maxWidth: '466px'
  },
  localBankTransferContent: {
    background: '#FFFFFF',
    borderRadius: '15px',
    boxShadow: '0 5px 10px 0 rgba(112,112,112,0.3)'
  },
  localBankTransferProgressBarContainer: {
    color: 'rgba(0, 0, 0, 0.65)',
    height: '200px',
    textAlign: 'center',

    '& img': {
      animation: 'zoomInAndOut 0.5s ease-in-out',
      margin: '30px 0 2px'
    },

    '& progress': {
      '-webkit-appearance': 'none',
      borderRadius: '7px',
      height: '8px',
      marginBottom: '2px',
      width: '100%',

      '&::-webkit-progress-bar': {
        background: '#f5f5f5',
        borderRadius: '7px'
      },

      '&::-webkit-progress-value': {
        background: '#34A220',
        borderRadius: '7px',
        transition: 'width 0.5s linear'
      }
    },

    '& p': {
      fontFamily: 'ProductSansRegular',
      fontSize: '14px',
      fontWeight: 'bold',
      margin: 0,
      textAlign: 'center'
    },

    '@media (min-width: 36em)': {
      minWidth: '450px'
    },
    '@media only screen and (min-device-width : 25em) and (max-device-width : 26em)': {
      minWidth: '325px'
    },
    '@media only screen and (min-device-width : 22em) and (max-device-width : 24em)': {
      minWidth: '270px'
    },
    '@media (max-width: 22.438em)': {
      minWidth: '232px'
    }
  }
}, {
  name: 'LocalBankTransfer'
})

const LocalBankTransfer = (props) => {
  const {
    bank,
    merchant,
    currency,
    requester,
    clientIp,
    callbackUri,
    amount,
    reference,
    datetime,
    signature,
    successfulUrl,
    failedUrl,
    note
  } = useContext(QueryParamsContext)

  const analytics = useContext(FirebaseContext)
  const [step, setStep] = useState(0)
  const [establishConnection, setEstablishConnection] = useState(false)
  const [loadingButton, setLoadingButton] = useState(false)
  const [error, setError] = useState(undefined)
  const [responseData, setResponseData] = useState({
    id: null,
    accountId: null,
    bankName: null,
    accountName: null,
    accountNumber: null,
    amount: null
  })
  const [progress, setProgress] = useState(undefined)
  const [transferResult, setTransferResult] = useState({
    statusCode: '',
    reference: '',
    statusMessage: '',
    amount: '',
    currency: '',
    isSuccessful: false
  })
  const language = props.language // language was handled at root component not at the queryparams
  const isBankKnown = checkBankIfKnown(currency, bank)
  const themeColor = isBankKnown ? `${bank}` : 'main'
  const session = `DEPOSIT-LOCAL-BANK-TRANSFER-${merchant}-${reference}`
  const classes = useStyles(step)
  const intl = props.intl

  async function handleSubmitLocalBankTransfer () {
    const submitValues = {
      amount,
      bank,
      callbackUri,
      clientIp,
      currency,
      customer: requester,
      datetime,
      failedUrl,
      key: signature,
      language,
      merchant,
      note,
      reference,
      requester: requester,
      signature,
      successfulUrl
    }
    setError(undefined)
    setLoadingButton(true)
    setProgress({
      currentStep: 1,
      totalSteps: 5,
      statusMessage: <FormattedMessage {...messages.progress.startingConnection} />
    })
    await sleep(750)
    setProgress({
      currentStep: 2,
      totalSteps: 5,
      statusMessage: <FormattedMessage {...messages.progress.encryptedTransmission} />
    })
    await sleep(750)
    setProgress({
      currentStep: 3,
      totalSteps: 5,
      statusMessage: <FormattedMessage {...messages.progress.beginningTransaction} />
    })
    await sleep(750)
    setProgress({
      currentStep: 4,
      totalSteps: 5,
      statusMessage: <FormattedMessage {...messages.progress.submittingTransaction} />
    })
    await sleep(750)
    setProgress({
      currentStep: 5,
      totalSteps: 5,
      statusMessage: <FormattedMessage {...messages.progress.waitingTransaction} />
    })

    try {
      await axios({
        url: 'api/localbanktransfer/post',
        method: 'POST',
        data: submitValues
      })
    } catch (error) {
      setProgress(undefined)
      setStep(1)
    }
  }

  const handleLocalBankTransferResult = useCallback(
    (resultLocalBankTransfer) => {
      setResponseData(resultLocalBankTransfer)

      if (resultLocalBankTransfer.status !== 200) {
        setError({
          code: '',
          message: resultLocalBankTransfer.message
        })
      }
    }, []
  )

  const handleLocalBankTransferSubmitResult = useCallback(
    (resultLocalBankTransferSubmit) => {
      setTransferResult({
        statusCode: resultLocalBankTransferSubmit.statusCode,
        reference: resultLocalBankTransferSubmit.reference,
        statusMessage: resultLocalBankTransferSubmit.statusMessage,
        amount: resultLocalBankTransferSubmit.amount,
        currency: resultLocalBankTransferSubmit.currency,
        isSuccessful: resultLocalBankTransferSubmit.statusCode === '006'
      })
      setLoadingButton(false)
      setProgress(undefined)
      setStep(1)
    }, []
  )

  function errorHandler (error, componentStack) {
    analytics.logEvent('exception', {
      stack: componentStack,
      description: error,
      fatal: true
    })
  }

  function renderStepContents () {
    switch (step) {
      case 0:
        return (
          <LocalBankTransferForm
            currency={currency}
            bank={bank}
            establishConnection={establishConnection}
            loadingButton={loadingButton}
            responseData={responseData}
            color={themeColor}
            handleSubmitLocalBankTransfer={handleSubmitLocalBankTransfer}
            error={error}
          />
        )

      case 1:
        if (transferResult.isSuccessful) {
          return (
            <AutoRedirect delay={10000} url={successfulUrl}>
              <TransferSuccessful transferResult={transferResult} language={language} />
            </AutoRedirect>
          )
        } else {
          return (
            <AutoRedirect delay={10000} url={failedUrl}>
              <TransferFailed transferResult={transferResult} language={language} />
            </AutoRedirect>
          )
        }

      default:
        break
    }
  }

  useEffect(() => {
    const queryParams = [
      bank,
      merchant,
      currency,
      requester,
      clientIp,
      callbackUri,
      amount,
      reference,
      datetime,
      signature,
      successfulUrl,
      failedUrl,
      note,
      language
    ]
    const currencies = ['THB']

    if (queryParams.includes(null)) {
      setTransferResult({
        statusCode: '001',
        isSuccess: false,
        message: <FormattedMessage {...messages.errors.verificationFailed} />
      })
      setStep(1)
    }

    if (!currencies.includes(currency?.toUpperCase())) {
      setTransferResult({
        statusCode: '001',
        isSuccess: false,
        message: <FormattedMessage {...messages.errors.verificationFailed} />
      })
      setStep(1)
    }
  }, [
    bank,
    merchant,
    currency,
    requester,
    clientIp,
    callbackUri,
    amount,
    reference,
    datetime,
    signature,
    successfulUrl,
    failedUrl,
    note,
    language
  ])

  useEffect(() => {
    const getLocalBankTransferPayload = {
      amount,
      bank,
      callbackUri,
      clientIp,
      currency,
      customer: requester,
      datetime,
      failedUrl,
      key: signature,
      language,
      merchant,
      note,
      reference,
      requester,
      signature,
      successfulUrl
    }

    const connection = new HubConnectionBuilder()
      .withUrl(API_USER_COMMAND_MONITOR)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build()

    connection.on('ReceiveLocalBankTransfer', handleLocalBankTransferResult)
    connection.on('CompletedLocalBankTransfer', handleLocalBankTransferSubmitResult)
    connection.onreconnected(async (e) => {
      await connection.invoke('LocalBankTransferStart', session, getLocalBankTransferPayload)
    })

    async function start () {
      try {
        await connection.start()
        await connection.invoke('LocalBankTransferStart', session, getLocalBankTransferPayload)
        setEstablishConnection(true)
      } catch (error) {
        setError({
          code: intl.formatMessage(messages.errors.networkErrorTitle),
          message: intl.formatMessage(messages.errors.networkError)
        })
        setEstablishConnection(true)
      }
    }

    connection.onclose(async () => {
      await start()
    })

    // Start the connection
    start()
  }, [
    session,
    handleLocalBankTransferResult,
    handleLocalBankTransferSubmitResult,
    amount,
    bank,
    callbackUri,
    clientIp,
    currency,
    datetime,
    failedUrl,
    language,
    merchant,
    note,
    reference,
    requester,
    signature,
    successfulUrl,
    intl
  ])

  useEffect(() => {
    window.onbeforeunload = window.onunload = (e) => {
      if (step === 0) {
        // this custom message will only appear on earlier version of different browsers.
        // However on modern and latest browsers their own default message will override this custom message.
        // as of the moment only applicable on browsers. there's no definite implementation on mobile
        e.returnValue = 'Do you really want to leave current page?'
      }
    }
  }, [step])

  return (
    <>
      <ErrorBoundary onError={errorHandler} FallbackComponent={FallbackComponent}>
        <QueryParamsValidator />
        <div className={classes.formWrapper}>
          <div className={classes.localBankTransferContainer}>
            <div className={classes.localBankTransferContent}>
              <section className={classes.localBankTransferHeader}>
                <Suspense fallback={<LoadingIcon />}>
                  <Logo bank={bank} currency={currency} />
                </Suspense>
                {
                  error && step === 0 &&
                    <ErrorAlert message={`Error ${error.code}: ${error.message}`} />
                }
              </section>
              <section className={classes.localBankTransferBody}>
                {
                  renderStepContents()
                }
              </section>
            </div>
            <StepsBar step={step === 1 ? 2 : step} />
          </div>
        </div>
        <ProgressModal open={progress}>
          <div className={classes.localBankTransferProgressBarContainer}>
            <img
              alt='submit-transaction'
              width='80'
              height='auto'
              src='/icons/in-progress.svg'
            />
            <progress
              value={
                progress && (progress.currentStep / progress.totalSteps) * 100
              }
              max={100}
            />
            <p>{progress && progress.statusMessage}</p>
          </div>
        </ProgressModal>
      </ErrorBoundary>
    </>
  )
}

export default injectIntl(LocalBankTransfer)
