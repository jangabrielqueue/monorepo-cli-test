import React, { useContext, useState } from 'react'
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
  qrCodeContainer: {
    margin: '0 auto',
    maxWidth: '466px'
  },
  qrCodeContent: {
    background: '#FFFFFF',
    borderRadius: '15px',
    boxShadow: '0 5px 10px 0 rgba(112,112,112,0.3)'
  },
  qrCodeBody: {
    padding: '20px',
    position: 'relative'
  },
  qrCodeHeader: {
    padding: '10px 20px',
    borderBottom: '0.5px solid #E3E3E3'
  },
  submitContainer: {
    margin: '0 10px',
    padding: '10px 0'
  },
  cryptoHeader: {
    display: 'flex',
    alignItems: 'center',
    '& p': {
      margin: '0 10px',
      color: '#1bb193',
      fontSize: 25
    }
  }
})

const currencies = [
  {
    code: 'VND',
    name: 'VND'
  },
  {
    code: 'THB',
    name: 'THB'
  },
  {
    code: 'IDR',
    name: 'IDR'
  },
  {
    code: 'RMB',
    name: 'RMB'
  },
  {
    code: 'KRW',
    name: 'KRW'
  }
]

const paymentChannelCases = {
  1: 'bank',
  2: 'qrcode'
}

const UsdtPage = (props) => {
  const {
    bank: crypto,
    merchant,
    requester,
    clientIp,
    callbackUri,
    amount: initialAmount,
    currency: initialCurrency,
    reference,
    datetime,
    signature,
    successfulUrl,
    failedUrl,
    note,
    language
  } = useContext(QueryParamsContext)
  const setQuery = useContext(QueryParamsSetterContext)
  const history = useHistory()
  const queryString = window.location.search
  const urlQueryString = new URLSearchParams(queryString)
  const { paymentChannel, paymentChannelType } = {
    paymentChannel: urlQueryString.get('p2'), // IB or QR
    paymentChannelType: urlQueryString.get('p3') // bank
  }
  const [amount, setAmount] = useState(initialAmount ?? 0)
  const [currency, setCurrency] = useState(initialCurrency ?? 'VND')
  const { register } = useFormContext()
  const convertion = 0.000098299
  const analytics = useContext(FirebaseContext)
  const classes = useStyles(0)

  function handleSubmitForm () {
    const queryString = `?b=${paymentChannelType}&m=${merchant}&c1=${currency}&c2=${requester}&c3=${clientIp}&c4=${callbackUri}&a=${amount}&r=${reference}&d=${datetime}&k=${signature}&su=${successfulUrl}&fu=${failedUrl}&n=${note}&l=${language}&p2=${paymentChannel}&p3${paymentChannelType}`
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
  return (
    <ErrorBoundary onError={errorHandler} FallbackComponent={FallbackComponent}>
      <QueryParamsValidator />
      <div className={classes.formWrapper}>
        <div className={classes.qrCodeContainer}>
          <div className={classes.qrCodeContent}>
            <section className={classes.qrCodeHeader}>
              <Logo />
              <div className={classes.cryptoHeader}>
                <p>Buy {crypto}</p>
                <img
                  alt={crypto}
                  width='50'
                  height='50'
                  src={require(`../../assets/banks/${crypto?.toUpperCase()}_LOGO.png`)}
                />
              </div>
            </section>
            <section className={classes.qrCodeBody}>
              <div style={{ display: 'grid', width: '100%', gridTemplateColumns: '2fr 1fr' }}>
                <input
                  style={{ border: '1px solid #E3E3E3' }}
                  ref={register({ required: <FormattedMessage {...messages.placeholders.inputLoginName} /> })}
                  type='number'
                  id='amount'
                  name='amount'
                  autoComplete='off'
                  onChange={(e) => setAmount(e.target.value)}
                  value={amount}
                />
                <select
                  id='currency'
                  name='currency'
                  style={{ border: '1px solid #E3E3E3' }}
                  onChange={(e) => setCurrency(e.target.value)}
                  value={currency}
                >
                  {
                      currencies?.map((item, i) => (
                        <option key={item.code} value={item.code}>
                          {
                            item.name
                          }
                        </option>
                      ))
                  }
                </select>
              </div>
              <section style={{ display: 'flex', alignItems: 'center', margin: '5px auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '40px', alignItems: 'center', width: '50px' }}>
                  <div style={{ backgroundColor: '#e3e3e3', flexGrow: 1, width: '2px' }} />
                  <div style={{ borderRadius: '50%', width: '10px', height: '10px', backgroundColor: '#e3e3e3' }} />
                  <div style={{ backgroundColor: '#e3e3e3', flexGrow: 1, width: '2px' }} />
                </div>
                <div style={{ fontSize: 12 }}>1 {currency} ~ {convertion} BTC Expected rate</div>
              </section>
              <div style={{ display: 'grid', width: '100%', gridTemplateColumns: '2fr 1fr', height: '40px' }}>
                <div
                  style={{ border: '1px solid #E3E3E3', lineHeight: '40px', padding: '4px' }}
                >
                  {amount * convertion || 0}
                </div>
                <div style={{ border: '1px solid #E3E3E3', lineHeight: '40px', padding: '4px' }}>{crypto}</div>
              </div>

            </section>
            <div className={classes.submitContainer}>
              <GlobalButton
                label={`Buy ${crypto}`}
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
