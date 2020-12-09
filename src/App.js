import React, { useState, useEffect, Suspense, lazy } from 'react'
import '@rmwc/button/styles'
import '@rmwc/dialog/styles'
import '@rmwc/tooltip/styles'
import '@rmwc/circular-progress/styles'
import * as firebase from 'firebase/app'
import 'firebase/analytics'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import axios from 'axios'
import { IntlProvider } from 'react-intl'
import localeEn from './translations/locale/en.json'
import localeVi from './translations/locale/vi.json'
import localeTh from './translations/locale/th.json'
import { ThemeProvider } from 'styled-components'
import GlobalStyles from './assets/styles/GlobalStyles'
import { useForm, FormContext } from 'react-hook-form'
import { Portal } from '@rmwc/base'
import FallbackPage from './components/FallbackPage'

const Deposit = lazy(() => import('./containers/Deposit'))
const ScratchCard = lazy(() => import('./containers/ScratchCard/ScratchCard'))
const TopUp = lazy(() => import('./containers/TopUp'))
const NotFound = lazy(() => import('./components/NotFound'))
const QRCode = lazy(() => import('./containers/QRCode'))

const theme = {
  colors: {
    main: '#91C431',
    faker: '#91C431',
    fakerthb: '#91C431',
    topup: '#1890ff',
    tcb: '#FF2600',
    tmb: '#008CCD',
    boa: '#FFCC2F',
    ktb: '#00B5E9',
    bbl: '#0048AA',
    kbank: '#00B463',
    scb: '#59358C',
    vib: '#007BC0',
    agri: '#AB1C40',
    exim: '#0071A7',
    dab: '#F49200',
    bidv: '#2B56AB',
    vcb: '#00613F',
    acb: '#0038A6',
    sacom: '#0A74BE',
    vtb: '#055893',
    permata: '#172D51',
    buttonPermata: '#008873',
    cimb: '#82162E',
    mandiri: '#0A4A8A',
    buttonMandiri: '#479DDA',
    bca: '#005caa',
    buttonBca: '#00b7f1',
    bri: '#014a94',
    buttonBri: '#f59823'
  }
}

const errorHandler = (error, componentStack) => {
  const analytics = firebase.analytics()
  analytics.logEvent('exception', {
    stack: componentStack,
    description: error,
    fatal: true
  })
}

const FallbackComponent = ({ componentStack, error }) => {
  return (
    <div>
      <p>
        <strong>Oops! An error occured!</strong>
      </p>
      <p>Please contact customer service</p>
      <p>
        <strong>Error:</strong> {error.toString()}
      </p>
      <p>
        <strong>Stacktrace:</strong> {componentStack}
      </p>
    </div>
  )
}

const App = (props) => {
  const { REACT_APP_ENDPOINT } = process.env
  axios.defaults.baseURL = REACT_APP_ENDPOINT
  axios.defaults.headers.post['Content-Type'] = 'application/json'
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const bank = urlParams.get('b')
  const merchant = urlParams.get('m')
  const reference = urlParams.get('r')
  const currency = urlParams.get('c1')
  const amount = urlParams.get('a')
  const methods = useForm()

  // Initialize Firebase
  if (!firebase.apps.length) {
    const {
      REACT_APP_FIREBASE_API_KEY,
      REACT_APP_FIREBASE_APP_ID,
      REACT_APP_FIREBASE_PROJ_ID,
      REACT_APP_FIREBASE_MSG_SENDER_ID,
      REACT_APP_FIREBASE_MEASUREMENT_ID
    } = process.env
    const firebaseConfig = {
      apiKey: REACT_APP_FIREBASE_API_KEY,
      authDomain: '',
      databaseURL: '',
      projectId: REACT_APP_FIREBASE_PROJ_ID,
      storageBucket: '',
      messagingSenderId: REACT_APP_FIREBASE_MSG_SENDER_ID,
      appId: REACT_APP_FIREBASE_APP_ID,
      measurementId: REACT_APP_FIREBASE_MEASUREMENT_ID
    }
    firebase.initializeApp(firebaseConfig)
  }

  const analytics = firebase.analytics()
  analytics.logEvent('open_deposit_page', {
    bank,
    merchant,
    reference,
    currency,
    amount
  })

  const [locale, setLocale] = useState('en')
  const [language, setLanguage] = useState('en-us')
  const localeMessages = {
    en: localeEn,
    vi: localeVi,
    th: localeTh
  }

  function handleSelectLanguage (param) {
    switch (param) {
      case 'vi-vn':
        setLocale('vi')
        setLanguage('vi-vn')
        break
      case 'th-th':
        setLocale('th')
        setLanguage('th-th')
        break
      default:
        setLocale('en')
        setLanguage('en-us')
    }
  }

  useEffect(() => {
    const url = new URL(window.location.href)
    const urlParams = new URLSearchParams(url.search)

    handleSelectLanguage(urlParams.get('l'))
  }, [])

  return (
    <FormContext {...methods}>
      <ThemeProvider theme={theme}>
        <ErrorBoundary onError={errorHandler} FallbackComponent={FallbackComponent}>
          <IntlProvider locale={locale} messages={localeMessages[locale]}>
            <GlobalStyles />
            <Portal />
            <Router>
              <Suspense fallback={<FallbackPage />}>
                <Switch>
                  <Route exact path='/topup/bank'>
                    <TopUp language={language} />
                  </Route>
                  <Route exact path='/deposit/bank'>
                    <Deposit language={language} />
                  </Route>
                  <Route exact path='/deposit/qrcode'>
                    <QRCode language={language} />
                  </Route>
                  <Route exact path='/deposit/scratch-card'>
                    <ScratchCard language={language} />
                  </Route>
                  <Route path='*'>
                    <NotFound />
                  </Route>
                </Switch>
              </Suspense>
            </Router>
          </IntlProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </FormContext>
  )
}

export default App
