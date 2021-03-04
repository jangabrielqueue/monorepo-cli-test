import React, { useState, useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import axios from 'axios'
import { IntlProvider } from 'react-intl'
import { createUseStyles, ThemeProvider } from 'react-jss'
import { useForm, FormContext } from 'react-hook-form'
import FallbackPage from './components/FallbackPage'
import QueryParamsContext from './contexts/QueryParamsContext'
import FirebaseContext from './contexts/FirebaseContext'
import GlobalStyles from '../src/assets/styles/GlobalStyles'

// lazy loaded components
const Deposit = lazy(() => import(/* webpackChunkName: 'deposit' */'./containers/Deposit'))
const ScratchCard = lazy(() => import(/* webpackChunkName: 'scratchcard' */'./containers/ScratchCard'))
const QRCode = lazy(() => import(/* webpackChunkName: 'qrcode' */'./containers/QRCode'))
const TopUp = lazy(() => import(/* webpackChunkName: 'topup' */'./containers/TopUp'))
const NotFound = lazy(() => import('./components/NotFound'))

// themes
const appTheme = {
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

const useStyles = createUseStyles({
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    height: '100%',
    justifyContent: 'center',
    backgroundImage: (props) => `linear-gradient(190deg, ${props.bank?.toUpperCase() ? appTheme.colors[`${props.themeColor?.toLowerCase()}`] : '#91C431'} 44%,
    #FFFFFF calc(44% + 2px))`,
    paddingTop: (props) => props.bank?.toUpperCase() === 'VCB' ? '105px' : '75px',
    '@media (max-width: 33.750em)': {
      paddingTop: (props) => props.bank?.toUpperCase() !== 'VCB' && '35px'
    }
  }
})

const queryString = window.location.search
const urlQueryString = new URLSearchParams(queryString)
const bank = urlQueryString.get('b')
const currency = urlQueryString.get('c1')

const App = () => {
  GlobalStyles()
  const { REACT_APP_ENDPOINT } = process.env
  axios.defaults.baseURL = REACT_APP_ENDPOINT
  axios.defaults.headers.post['Content-Type'] = 'application/json'
  const [locale, setLocale] = useState('en')
  const [language, setLanguage] = useState('en-us')
  const [dynamicLoadBankUtils, setDynamicLoadBankUtils] = useState(null)
  const isBankKnown = dynamicLoadBankUtils?.checkBankIfKnown(currency, bank)
  const topUpTheme = window.location.pathname.includes('topup')
  const themeColor = topUpTheme ? 'topup' : renderIsBankUnknown()
  const localeMessages = {
    en: dynamicLoadBankUtils?.localeEn,
    vi: dynamicLoadBankUtils?.localeVi,
    th: dynamicLoadBankUtils?.localeTh,
    id: dynamicLoadBankUtils?.localeId
  }
  const methods = useForm({
    defaultValues: {
      telcoName: bank?.toUpperCase() === 'GWC' ? 'GW' : 'VTT'
    }
  })
  const classes = useStyles({ bank, themeColor })

  function renderIsBankUnknown () {
    if (isBankKnown === undefined) {
      return ''
    } else if (isBankKnown) {
      return `${bank}`
    } else {
      return 'main'
    }
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
      case 'id-id':
        setLocale('id')
        setLanguage('id-id')
        break
      default:
        setLocale('en')
        setLanguage('en-us')
    }
  }

  useEffect(() => {
    const url = new URL(window.location.href)
    const urlParams = new URLSearchParams(url.search)
    const language = urlParams.get('l')

    async function dynamicLoadModules () { // dynamically load bank utils
      const { checkBankIfKnown } = await import('./utils/banks')
      const localeEn = await import('./translations/locale/en.json')
      const localeVi = await import('./translations/locale/vi.json')
      const localeTh = await import('./translations/locale/th.json')
      const localeId = await import('./translations/locale/id.json')
      setDynamicLoadBankUtils({
        checkBankIfKnown,
        localeEn,
        localeVi,
        localeTh,
        localeId
      })
    }

    dynamicLoadModules()
    handleSelectLanguage(language)
  }, [])

  return (
    <FirebaseContext>
      <QueryParamsContext>
        <FormContext {...methods}>
          <ThemeProvider theme={appTheme}>
            <IntlProvider locale={locale} messages={localeMessages[locale]}>
              <div className={classes.wrapper}>
                <Suspense fallback={<FallbackPage />}>
                  <Router>
                    <Switch>
                      <Route exact path='/deposit/bank'>
                        <Deposit language={language} />
                      </Route>
                      <Route exact path='/deposit/scratch-card'>
                        <ScratchCard language={language} />
                      </Route>
                      <Route exact path='/deposit/qrcode'>
                        <QRCode language={language} />
                      </Route>
                      <Route exact path='/topup/bank'>
                        <TopUp language={language} />
                      </Route>
                      <Route path='*'>
                        <NotFound />
                      </Route>
                    </Switch>
                  </Router>
                </Suspense>
              </div>
            </IntlProvider>
          </ThemeProvider>
        </FormContext>
      </QueryParamsContext>
    </FirebaseContext>
  )
}

export default App
