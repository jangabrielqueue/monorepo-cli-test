import React, { useCallback, useContext, useEffect, useState } from 'react'
import { QueryParamsContext, QueryParamsSetterContext } from '../../contexts/QueryParamsContext'
import { ErrorBoundary } from 'react-error-boundary'
// import { QueryParamsValidator } from '../../components/QueryParamsValidator'
import { FirebaseContext } from '../../contexts/FirebaseContext'
import { FallbackComponent } from '../../components/FallbackComponent'
import { createUseStyles } from 'react-jss'
import { FormattedMessage, injectIntl } from 'react-intl'
import Logo from '../../components/Logo'
import GlobalButton from '../../components/GlobalButton'
import { useFormContext } from 'react-hook-form'
import messages from '../Deposit/messages'
import { useHistory } from 'react-router'
import { QueryParamsValidator } from '../../components/QueryParamsValidator'
import { getBankRequest } from './Request'
const useStyles = createUseStyles({
  formWrapper: {
    height: '100%',
    minWidth: '500px',
    padding: '75px 0 0',

    '@media (max-width: 36em)': {
      minWidth: 0,
      overflowY: 'scroll',
      maxHeight: 'calc(100vh - 0px)'
    },

    '@media (max-width: 33.750em)': {
      padding: '35px 20px 0'
    }
  },
  crpytoContainer: {
    margin: '0 auto',
    maxWidth: '466px'
  },
  cryptoContent: {
    background: '#FFFFFF',
    borderRadius: '15px',
    boxShadow: '0 5px 10px 0 rgba(112,112,112,0.3)'
  },
  cryptoBody: {
    padding: '20px 20px 0 20px',
    position: 'relative'
  },
  cryptoHeader: {
    padding: '10px 20px',
    borderBottom: '0.5px solid #E3E3E3'
  },
  submitContainer: {
    margin: '0 10px',
    padding: '10px 0'
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
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '2fr 1fr',
    border: '1px solid #E3E3E3 !important',
    borderRadius: '10px'
  },
  inputBankWrapper: {
    marginBottom: 20
  },
  inputSelect: {
    width: '100%',
    border: '1px solid #E3E3E3 !important',
    borderRadius: '10px'
  },
  inputContainer: {
    paddingLeft: 6,
    border: 'none !important',
    lineHeight: '38px',
    background: 'transparent',
    '&:last-child': {
      borderLeft: '1px solid #E3E3E3 !important'
    }
  },
  timelineWrapper: {
    display: 'flex',
    alignItems: 'center',
    margin: '5px auto'
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
  bankDisplayWrapper: {

  }
})

const paymentChannelCases = {
  1: 'bank',
  2: 'qrcode'
}

const conversionCases = {
  VND: 23644.64,
  THB: 34.58,
  KRW: 1315.10,
  IDR: 15431.84,
  RMB: 6.92
}
const UsdtPage = (props) => {
  const {
    bank: crypto,
    merchant,
    requester,
    clientIp,
    callbackUri,
    amount: initialAmount,
    currency,
    reference,
    datetime,
    signature,
    successfulUrl,
    failedUrl,
    note,
    language,
    paymentChannel,
    paymentChannelType
  } = useContext(QueryParamsContext)
  const setQuery = useContext(QueryParamsSetterContext)
  const history = useHistory()
  const [amount, setAmount] = useState(initialAmount ?? 0)
  const { register } = useFormContext()
  const conversion = conversionCases[currency] // USDT to selected currency
  const [converted, setConverted] = useState((initialAmount ?? 0) / conversion)
  const analytics = useContext(FirebaseContext)
  const classes = useStyles(0)
  const noBankSelected = paymentChannelType === 'null' || paymentChannelType == null
  const noAmount = initialAmount === 'null' || initialAmount == null
  const [banks, setBanks] = useState([])
  const [bank, setBank] = useState(noBankSelected ? '' : paymentChannelType)

  function handleSubmitForm () {
    const queryString = `?b=${bank}&m=${merchant}&c1=${currency}&c2=${requester}&c3=${clientIp}&c4=${callbackUri}&a=${amount}&r=${reference}&d=${datetime}&k=${signature}&su=${successfulUrl}&fu=${failedUrl}&n=${note}&l=${language}&p2=${paymentChannel}&p3${paymentChannelType}`
    const url = `/deposit/${paymentChannelCases[paymentChannel]}${queryString}`
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
    setAmount(value * conversion)
    setConverted(value)
  }
  const getBanks = useCallback(async () => {
    const res = await getBankRequest({ paymentChannel, currency })
    setBanks(res)
  }, [paymentChannel, currency])
  useEffect(() => {
    getBanks().finally(() => {})
  }, [getBanks])
  return (
    <ErrorBoundary onError={errorHandler} FallbackComponent={FallbackComponent}>
      <QueryParamsValidator />
      <div className={classes.formWrapper}>
        <div className={classes.cryptoContainer}>
          <div className={classes.cryptoContent}>
            <section className={classes.cryptoHeader}>
              <Logo />
              <div className={classes.cryptoLogoHeader}>
                <p>Buy {crypto}</p>
                <img
                  alt={crypto}
                  width='50'
                  height='50'
                  src={require(`../../assets/banks/${crypto?.toUpperCase()}_LOGO.png`)}
                />
              </div>
            </section>
            <section className={classes.cryptoBody}>
              {
                noBankSelected && (
                  <div className={classes.inputBankWrapper}>
                    <label>Bank:</label>
                    <select className={classes.inputSelect} onChange={(e) => setBank(e.target.value)}>
                      <option disabled selected value>--Select Bank--</option>
                      {
                        banks.map((bank, i) => (
                          <option key={i} value={bank.value}>{bank.text}</option>
                        ))
                      }
                    </select>
                  </div>
                )
              }
              <div className={classes.inputWrapper}>
                {
                  noAmount ? (
                    <input
                      className={classes.inputContainer}
                      ref={register({ required: <FormattedMessage {...messages.placeholders.inputLoginName} /> })}
                      type='number'
                      id='converted'
                      name='converted'
                      autoComplete='off'
                      onChange={handleChange}
                      value={converted}
                    />)
                    : (
                      <div className={classes.inputContainer}>{converted}</div>
                    )
                }
                <div className={classes.inputContainer}>{crypto}</div>
              </div>
              <section className={classes.timelineWrapper}>
                <div className={classes.timeline}>
                  <div className={classes.timelineLine} />
                  <div className={classes.timelineCircle} />
                  <div className={classes.timelineLine} />
                </div>
                <div style={{ fontSize: 12 }}> {conversion} {currency} ~ 1 {crypto} Expected rate</div>
              </section>
              <div className={classes.inputWrapper}>
                <div
                  className={classes.inputContainer}
                >
                  {amount || 0}
                </div>
                <div className={classes.inputContainer}>{currency}</div>
              </div>
              {bank !== '' && (
                <div className={classes.bankDisplayWrapper}>
                  <Logo bank={bank} currency={currency} />
                </div>)}
            </section>
            <div className={classes.submitContainer}>
              <GlobalButton
                label='Continue'
                color='main'
                onClick={handleSubmitForm}
              />
            </div>
          </div>
        </div>
      </div>

    </ErrorBoundary>
  )
}

export default injectIntl(UsdtPage)
