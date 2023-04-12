import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { QueryParamsContext, QueryParamsSetterContext } from '../../contexts/QueryParamsContext'
import { ErrorBoundary } from 'react-error-boundary'
// import { QueryParamsValidator } from '../../components/QueryParamsValidator'
import { FirebaseContext } from '../../contexts/FirebaseContext'
import { FallbackComponent } from '../../components/FallbackComponent'
import { createUseStyles } from 'react-jss'
import { FormattedMessage, injectIntl } from 'react-intl'
import Logo from '../../components/Logo'
import GlobalButton from '../../components/GlobalButton'
import messages from './messages'
import { useHistory } from 'react-router'
import { QueryParamsValidator } from '../../components/QueryParamsValidator'
import { getBankRequest, getExchangeRateRequest } from './Request'
import ErrorAlert from '../../components/ErrorAlert'
import { checkBankIfKnown } from '../../utils/banks'
import TransferFailed from '../../components/TransferFailed'
import AutoRedirect from '../../components/AutoRedirect'
import { cryptoHelperTexts, getCurrencyText } from '../../utils/utils'
import LoadingIcon from '../../components/LoadingIcon'
import InputSelect from '../../components/Inputs/InputSelect'
// import logo from
const useStyles = createUseStyles({
  formWrapper: {
    height: '100%',
    minWidth: '500px',
    padding: '75px 0 0 0',

    '@media (max-width: 36em)': {
      minWidth: 'calc(36em - 175px)'
    },

    '@media (max-width: 33.750em)': {
      padding: '35px 20px 0'
    }
  },
  cryptoContainer: {
    margin: '0 auto',
    maxWidth: '466px'
  },
  cryptoContent: {
    background: '#FFFFFF',
    borderRadius: '15px',
    boxShadow: '0 5px 10px 0 rgba(112,112,112,0.3)'
  },
  cryptoBody: {
    padding: '20px',
    position: 'relative'
  },
  cryptoHeader: {
    padding: '10px 20px',
    borderBottom: '0.5px solid #E3E3E3'
  },
  submitContainer: {
    padding: '10px 0 20px'
  },
  cryptoLogoHeader: {
    display: 'flex',
    alignItems: 'center',
    '& p': {
      margin: '0 10px',
      color: '#1bb193',
      fontSize: 25
    }
  },
  inputWrapper: {
    display: 'flex',
    width: '100%',
    border: '1px solid #E3E3E3 !important',
    borderRadius: '10px'
  },
  inputBankWrapper: {
    margin: '20px 0'
  },
  inputSelect: {
    width: '100%',
    border: '1px solid #E3E3E3 !important',
    minHeight: '38px',
    borderRadius: '10px',
    height: '100%',
    '&:last-child': {
      borderLeft: '1px solid #E3E3E3 !important',
      padding: 5
    }
  },
  inputContainer: {
    flex: 2,
    display: 'flex',
    alignItems: 'center',
    height: 'auto !important',
    padding: '10px 6px !important',
    border: 'none !important',
    background: 'transparent',
    fontSize: '26px !important'
  },
  inputLabelContainer: {
    padding: '10px 0 10px 10px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    borderLeft: '1px solid #E3E3E3 !important'
  },
  inputLabel: {
    fontSize: 16
  },
  inputHelperText: {
    fontSize: 11,
    color: '#9e9e9e'

  },
  timelineWrapper: {
    display: 'flex',
    alignItems: 'center',
    margin: '5px auto',
    color: '#9e9e9e'
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    height: '40px',
    alignItems: 'center',
    width: '50px'
  },
  timelineLine: {
    backgroundColor: '#e3e3e3',
    flexGrow: 1,
    width: '2px'
  },
  timelineCircle: {
    borderRadius: '50%',
    width: '10px',
    height: '10px',
    backgroundColor: '#e3e3e3'
  },
  unknownBankError: {
    marginBottom: 10
  },
  bankDisplay: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    borderTop: '1px solid #E3E3E3',
    padding: '20px 0',
    '& p': {
      fontStyle: 'italic',
      color: '#9e9e9e',
      margin: 0,
      paddingRight: 10
    }
  }
})

const paymentChannelCases = {
  1: '/deposit/bank',
  3: '/deposit/qrcode'
}

const cryptoMinMax = {
  'USDT-TRC20': [20, 25000]
}
const renderOptions = (option, currency) => {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', padding: 15, borderBottom: '1px solid #e3e3e3' }}>
        <Logo bank={option.value} currency={currency} noMargin width={120} height={20} />
        {' '}
        <p style={{ margin: 0, fontStyle: 'italic', color: '#9e9e9e' }}> - {option.label}</p>
      </div>
    </>
  )
}

const autoBankLabel = {
  VND: 'VietQR',
  THB: 'ThaiQR',
  IDR: 'QRIS'
}
const ConversionPage = (props) => {
  const {
    bank: queryBank,
    merchant,
    amount: initialConverted, // number || 0
    currency,
    failedUrl,
    language,
    toCurrency: crypto,
    methodType,
    requester,
    clientIp,
    callbackUri,
    reference,
    datetime,
    signature,
    successfulUrl,
    note,
  } = useContext(QueryParamsContext)
  const setQuery = useContext(QueryParamsSetterContext)
  const history = useHistory()
  const [cryptoAmount, setCryptoAmount] = useState(initialConverted || '')
  const [conversion, setConversion] = useState(null)
  const amount = cryptoAmount * conversion
  const analytics = useContext(FirebaseContext)
  const classes = useStyles(0)
  const noBankSelected = queryBank === 'null' || queryBank == null
  const noAmount = initialConverted === '0' || initialConverted === 0 || initialConverted === 'null' || initialConverted == null
  const [banks, setBanks] = useState([])
  const [bank, setBank] = useState(noBankSelected ? '' : queryBank)
  const [error, setError] = useState({ hasError: false, message: '' })
  const exchangeRate = useRef(null)
  const bankIsKnown = checkBankIfKnown(currency, queryBank) || queryBank === 'AUTO' || noBankSelected
  const validQueryAmount = initialConverted % 1 === 0
  const min = crypto in cryptoMinMax ? cryptoMinMax[crypto][0] : 0
  const max = crypto in cryptoMinMax ? cryptoMinMax[crypto][1] : Infinity
  const helperText = crypto in cryptoHelperTexts ? cryptoHelperTexts[crypto] : { title: '', helperText: '' }

  const bankList = banks.map((bank) => ({
    label: bank.text === 'AUTO' ? autoBankLabel[currency] ?? 'AUTO' : bank.text,
    value: bank.value
  }))
  function handleSubmitForm () {
    if (bank === '') {
      setError({ hasError: true, message: 'Please Select a bank' })
      return
    }
    if (cryptoAmount < min || cryptoAmount > max) {
      setError({ hasError: true, message: `Error:  amount must be in the range of ${min} - ${max} ${crypto}` })
      return
    }
    if (conversion === 0) return
    const roundedoffAmount = Math.round(amount)
    const queryString = `?b=${bank}&m=${merchant}&c1=${currency}&c2=${requester}&c3=${clientIp}&c4=${callbackUri}&a=${roundedoffAmount}&r=${reference}&d=${datetime}&k=${signature}&su=${successfulUrl}&fu=${failedUrl}&n=${note}&l=${language}&mt=${methodType}&ec=USD&ea=${cryptoAmount}&er=${exchangeRate.current}&tc=${crypto}`
    const url = `${paymentChannelCases[methodType]}${queryString}`
    setQuery(queryString)
    history.push(url)
  }

  function errorHandler (error, componentStack) {
    analytics.logEvent('exception', {
      stack: componentStack,
      description: error,
      fatal: true
    })
  }

  function handleChange (e) {
    const value = e.target.value
    if (/^(?!0)\d*$/.test(value)) {
      setCryptoAmount(value)
    }
  }
  const getBanks = useCallback(async () => {
    const res = await getBankRequest({ currency, methodType })
    setBanks(res)
  }, [methodType, currency])

  const getRates = useCallback(async () => {
    const res = await getExchangeRateRequest({ methodType, transactionType: 1, paymentChannel: methodType, merchant })
    if (res != null && Object.hasOwn(res, currency)) {
      const rate = res[currency]
      setConversion(rate.value)
      exchangeRate.current = rate.value
    } else {
      const message = res.error?.message == null ? (
      <><FormattedMessage {...messages.errors.networkErrorTitle} />: <FormattedMessage {...messages.errors.networkError} /></>
      ): (
        <><FormattedMessage {...messages.errors.error} />: {res.error?.message}</>
      )
      setConversion(0)
      setError({ hasError: true, message })
    }
  }, [methodType, currency, merchant])

  useEffect(() => {
    getBanks().finally(() => {})
  }, [getBanks])

  useEffect(() => {
    getRates().finally(() => {})
  }, [getRates])

  useEffect(() => {
    setCryptoAmount(initialConverted || '')
  }, [initialConverted])

  const renderBody = (
    <>
      <section className={classes.cryptoBody}>
        <div className={classes.inputWrapper}>
          {
            noAmount ? (
              <input
                className={classes.inputContainer}
                type='text'
                id='converted'
                name='converted'
                autoComplete='off'
                autoFocus
                onChange={handleChange}
                value={cryptoAmount}
              />)
              : (
                <div className={classes.inputContainer}>{new Intl.NumberFormat(language).format(cryptoAmount)}</div>
              )
          }
          <div className={classes.inputLabelContainer}>
            <div className={classes.inputLabel}>
              {helperText.title}
            </div>
            <div className={classes.inputHelperText}>
              {helperText.helperText}
            </div>
          </div>
        </div>
        <section className={classes.timelineWrapper}>
          <div className={classes.timeline}>
            <div className={classes.timelineLine} />
            <div className={classes.timelineCircle} />
            <div className={classes.timelineLine} />
          </div>
          <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column' }}>
            {
              conversion == null ? <LoadingIcon /> : <>1 {crypto} ~ {new Intl.NumberFormat(language).format(conversion.toFixed(2))} {currency} <FormattedMessage {...messages.notes.expectedRateTitle} /></>
            }
            <div style={{ fontSize: 10 }}>
              <b><FormattedMessage {...messages.notes.noteTitle} /></b> <FormattedMessage {...messages.notes.expectedRate} />
            </div>
          </div>
        </section>
        <div className={classes.inputWrapper}>
          <div
            className={classes.inputContainer}
          >
            ~ {new Intl.NumberFormat(language).format(amount.toFixed(2)) || 0}
          </div>
          <div className={classes.inputLabelContainer}>
            <div className={classes.inputLabel}>
              {currency}
            </div>
            <div className={classes.inputHelperText}>
              {getCurrencyText(currency)}
            </div>
          </div>
        </div>
        {
          noBankSelected && (
            <div className={classes.inputBankWrapper}>
              <InputSelect
                onChange={(val) => setBank(val)}
                label='Pay with:'
                options={bankList}
                renderOptions={(option) => renderOptions(option, currency)}
                placeholder='Select Bank'
                value={bank}
              />
            </div>
          )
        }
        <div className={classes.submitContainer}>
          <GlobalButton
            label='Continue'
            color='main'
            onClick={handleSubmitForm}
          />
        </div>
        {!noBankSelected && (
          <div className={classes.bankDisplay}>
            <p>Pay with</p>
            <Logo bank={queryBank} currency={currency} noMargin height={30} width='auto' />
          </div>)}
      </section>
    </>
  )
  return (
    <ErrorBoundary onError={errorHandler} FallbackComponent={FallbackComponent}>
      <QueryParamsValidator />
      <div className={classes.formWrapper}>
        <div className={classes.cryptoContainer}>
          <div className={classes.cryptoContent}>
            <section className={classes.cryptoHeader}>
              <Logo />
              {
                error.hasError && <ErrorAlert message={error.message} />
              }
            </section>
            {
              (bankIsKnown && validQueryAmount) ? renderBody : (
                <div className={classes.unknownBankError}>
                  <AutoRedirect delay={10000} url={failedUrl}>
                    <TransferFailed bank={bank} transferResult={{ message: <FormattedMessage {...messages.errors.verificationFailed} /> }} />
                  </AutoRedirect>
                </div>
              )
            }
          </div>
        </div>
      </div>

    </ErrorBoundary>
  )
}

export default injectIntl(ConversionPage)