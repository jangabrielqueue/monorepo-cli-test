import React, { useState, useEffect, Suspense, lazy, useContext, useLayoutEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import axios from 'axios'
import { IntlProvider } from 'react-intl'
import { createUseStyles, ThemeProvider } from 'react-jss'
import { useForm, FormContext } from 'react-hook-form'
import FallbackPage from './components/FallbackPage'
import GlobalStyles from '../src/assets/styles/GlobalStyles'
import { checkBankIfKnown } from './utils/banks'
import localeEn from './translations/locale/en.json'
import localeVi from './translations/locale/vi.json'
import localeTh from './translations/locale/th.json'
import localeId from './translations/locale/id.json'
import localeCn from './translations/locale/cn.json'
import localeKo from './translations/locale/ko.json'
import { QueryParamsContext } from './contexts/QueryParamsContext'
import GWLOGO from './assets/banks/GW_LOGO.png'
import GWLOGOICON from './assets/banks/GW_LOGO_ICON.png'
import SRPAYLOGO from './assets/banks/SRPAY_LOGO.png'

// lazy loaded components
const Conversion = lazy(() => import('./containers/Conversion'))
const GritPay = lazy(() => import('./containers/GritPay'))
const Deposit = lazy(() => import(/* webpackChunkName: 'deposit' */'./containers/Deposit'))
const ScratchCard = lazy(() => import(/* webpackChunkName: 'scratchcard' */'./containers/ScratchCard'))
const QRCode = lazy(() => import(/* webpackChunkName: 'qrcode' */'./containers/QRCode'))
const LocalBankTransfer = lazy(() => import(/* webpackChunkName: 'localbanktransfer' */'./containers/LocalBankTransfer'))
const TopUp = lazy(() => import(/* webpackChunkName: 'topup' */'./containers/TopUp'))
const NotFound = lazy(() => import(/* webpackChunkName: 'notfound' */'./components/NotFound'))
const CustomErrorPages = lazy(() => import(/* webpackChunkName: 'badrequest' */'./components/CustomErrorPages'))

const GW = {
  main: '#91C431',
  logo: GWLOGO,
  logoIcon: GWLOGOICON,
  logoHref: './GW_LOGO.png',
  title: 'Game Wallet'
}

const SRP = {
  main: '#2196f3',
  logo: SRPAYLOGO,
  logoIcon: SRPAYLOGO,
  logoHref: './SRPAY_LOGO.png',
  title: 'SRPay'
}

const isGWorSRP = window.location.hostname.toLowerCase().includes('gamewallet')
export const theme = isGWorSRP ? GW : SRP

// themes
const appTheme = {
  colors: {
    main: theme.main,
    faker: theme.main,
    fakerthb: theme.main,
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
    bidv: '#0066ad',
    vcb: '#00613F',
    acb: '#0038A6',
    sacom: '#0A74BE',
    vtb: '#055893',
    permata: '#172D51',
    buttonPermata: '#008873',
    cimb: '#82162E',
    mandiri: '#0A4A8A',
    buttonMandiri: '#479DDA',
    bca: '#093966',
    buttonBca: '#0066ae',
    bri: '#014a94',
    buttonBri: '#f59823',
    notificationVCB: '#ffffcc',
    notificationBIDV: '#f1faff',
    notificationFontBIDV: '#0066ad',
    bni: '#f15922',
    buttonBni: '#005f6b',
    msb: '#e71e24',
    truewallet: '#ff7f02',
    momo: '#a50064',
    zalopay: '#118bca'
  }
}

const useStyles = createUseStyles({
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    height: '100%',
    justifyContent: 'center',
    backgroundImage: (props) => props.bank?.toUpperCase() === 'BIDV' ? 'linear-gradient(190deg, #00bfae, #0066ad 44%, #FFFFFF calc(44% + 2px))' : `linear-gradient(190deg, ${props.bank?.toUpperCase() ? appTheme.colors[`${props.themeColor?.toLowerCase()}`] : '#91C431'} 44%,
    #FFFFFF calc(44% + 2px))`
  }
})

const App = () => {
  const { bank, currency } = useContext(QueryParamsContext)
  GlobalStyles()
  const { REACT_APP_ENDPOINT } = process.env
  axios.defaults.baseURL = REACT_APP_ENDPOINT
  axios.defaults.headers.post['Content-Type'] = 'application/json'
  const [locale, setLocale] = useState('en')
  const [language, setLanguage] = useState('en-us')
  const isBankKnown = checkBankIfKnown(currency, bank)
  const topUpTheme = window.location.pathname.includes('topup')
  const themeColor = topUpTheme ? 'topup' : renderIsBankUnknown()
  const localeMessages = {
    en: localeEn,
    vi: localeVi,
    th: localeTh,
    id: localeId,
    cn: localeCn,
    ko: localeKo
  }
  useLayoutEffect(() => {
    document.title = theme.title
  }, [])
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
    switch (param?.toLowerCase()) {
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
      case 'zh-cn':
        setLocale('cn')
        setLanguage('zh-cn')
        break
      case 'ko-kr':
        setLocale('ko')
        setLanguage('ko-kr')
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

    handleSelectLanguage(language)
  }, [])

  return (

    <FormContext {...methods}>
      <ThemeProvider theme={appTheme}>
        <IntlProvider locale={locale} messages={localeMessages[locale]}>
          <div id='backdrop' />
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
                  <Route exact path='/deposit/local-bank-transfer'>
                    <LocalBankTransfer language={language} />
                  </Route>
                  <Route exact path='/topup/bank'>
                    <TopUp language={language} />
                  </Route>
                  <Route exact path='/deposit/channel'>
                    <GritPay language={language} />
                  </Route>
                  <Route exact path='/deposit/crypto'>
                    <Conversion language={language} />
                  </Route>
                  <Route path='/error'>
                    <CustomErrorPages />
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
  )
}

export default App
