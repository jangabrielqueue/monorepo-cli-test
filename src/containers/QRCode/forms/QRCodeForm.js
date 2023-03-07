import React, { memo, lazy } from 'react'
import { FormattedMessage } from 'react-intl'
import messages from '../messages'
import QRCode from 'qrcode.react'
import { createUseStyles } from 'react-jss'
import {
  checkBankIfKnown,
  checkIfVndCurrency,
  checkIfBidvBank,
  checkIfAcbBank,
  checkIfFakerBank,
  checkIfFakerThbBank,
  checkIfNullBank,
  checkIfAutoBank,
  checkIfMsbBank,
  checkifAgriBank,
  checkIfDABBank,
  checkIfTcbBank,
  checkIfSacomBank,
  checkIfTrueWalletBank,
  checkIfMomoBank,
  checkIfZaloBank
} from '../../../utils/banks'
import generatePayload from '../../../components/PromptpayQr'
import getVietQRCode from '../../../components/VietQr'
import { theme } from '../../../App'

// lazy loaded components
const GlobalButton = lazy(() => import('../../../components/GlobalButton'))

// styling
const useStyles = createUseStyles({
  qrCodeContainer: {
    textAlign: 'center',

    '& h1': {
      color: '#3f3f3f',
      fontSize: '42px',
      fontWeight: '600',
      margin: '0 0 8px 0',

      '& span': {
        position: 'relative',

        '&:before': {
          content: (props) => `"${props.currency}"`,
          fontSize: '14px',
          left: '-32px',
          position: 'absolute',
          top: '20px'
        }
      }
    },

    '& svg': {
      border: '1px solid #1e427e',
      padding: '7px'
    }
  },
  qrcodeBottomLogos: {
    display: 'flex',
    justifyContent: 'center',
    margin: '10px 0',

    '& div': {
      '&:first-child': {
        borderRight: '2px solid #1b427f'
      },
      '&:last-child': {
        '& > img': {
          marginBottom: (props) => (
            checkIfBidvBank(props.bank) ||
            checkIfAcbBank(props.bank) ||
            checkIfFakerBank(props.bank) ||
            checkIfFakerThbBank(props.bank) ||
            checkIfNullBank(props.bank) ||
            checkIfAutoBank(props.bank) ||
            checkifAgriBank(props.bank) ||
            checkIfDABBank(props.bank) ||
            checkIfTcbBank(props.bank) ||
            checkIfSacomBank(props.bank)
          ) ? '7px' : (
              checkIfMsbBank(props.bank) ? 0 : '15px')
        }
      }
    }
  },
  qrcodeBottomLogoWrapper: {
    padding: '0 10px',
    height: '35px',
    display: 'flex',
    alignItems: 'center',

    '& img': {
      maxHeight: '27px',
      maxWidth: '120px',
      width: '100%'
    }
  },
  accountStatisticsContainer: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    textAlign: 'center',

    '& li': {
      fontSize: '16px',
      margin: '5px 0',

      '&:first-child': {
        fontWeight: '600'
      },

      '&:nth-child(2)': {
        color: '#3f3f3f',
        fontWeight: '600'
      },

      '&:last-child': {
        fontSize: '14px',
        fontStyle: 'italic'
      }
    }
  },
  submitContainer: {
    margin: '0 auto',
    padding: '20px 0',
    maxWidth: '230px'
  },
  importantNote: {
    color: '#3f3f3f',
    fontFamily: 'ProductSansBold',
    fontSize: '14px',
    margin: '0 0 10px'
  },
  importantList: {
    fontSize: '14px',
    margin: 0,
    padding: '0 0 0 15px'
  }
})

const THBQrLogoCases = {
  TRUEWALLET: '/logo/TRUEWALLET_LOGO.png',
  default: theme.logoIcon
}

const THBQrLogo = (bank) => {
  const bankSelected = bank.toUpperCase()
  return THBQrLogoCases[bankSelected] || THBQrLogoCases.default
}

function handleQRCodeRender (qrCodeProps) {
  return (
    <QRCode
      value={qrCodeProps.value}
      size={200}
      renderAs='svg'
      level='M'
      imageSettings={{
        src: qrCodeProps.logo,
        x: null,
        y: null,
        height: 40,
        width: 40,
        excavate: true
      }}
    />)
}

const QRCodeForm = memo(function QRCodeForm (props) {
  const {
    currency,
    bank,
    establishConnection,
    loadingButton,
    responseData,
    handleSubmitQRCode,
    error,
    language,
    reference
  } = props

  const isMomoBank = checkIfMomoBank(bank)
  const isZaloBank = checkIfZaloBank(bank)
  const isTrueWallet = checkIfTrueWalletBank(bank)
  const isBankKnown = checkBankIfKnown(currency, responseData.bank)
  const buttonColor = isTrueWallet || isMomoBank || isZaloBank ? `${bank}` : isBankKnown ? `${responseData.bank}` : 'main'
  const currencies = currency?.toUpperCase()
  const amount = parseFloat(responseData.amount)
  const classes = useStyles({ currency, bank })

  function handleSubmitForm () {
    handleSubmitQRCode()
  }

  function handleRenderBottomLogo () {
    if (isBankKnown) {
      return require(`../../../assets/banks/${bank?.toUpperCase()}_LOGO.png`)
    }
    return require('../../../assets/banks/NULL_LOGO.png')
  }

  const getValue = () => {
    if (currencies === 'THB') return generatePayload(responseData?.qrCodeContent?.toString(), { amount })
    if (currencies === 'VND') return getVietQRCode(responseData.bank, responseData.qrCodeContent, responseData.amount, reference)
    return responseData?.qrCodeContent
  }

  const getLogo = () => {
    if (currencies === 'THB') return THBQrLogo(bank)
    return theme.logoIcon
  }

  return (
    <main>
      {
        <div className={classes.qrCodeContainer}>
          <h1><span>{`${new Intl.NumberFormat(language).format(responseData.amount)}`}</span></h1>
          {
            !establishConnection ? <div className='loading' />
              : error || responseData.qrCodeContent === null ? null : handleQRCodeRender({ value: getValue(), logo: getLogo() }) // eslint-disable-line
          }
        </div>
      }
      {
        !isMomoBank && !isZaloBank && checkIfVndCurrency(currency) &&
          <div className={classes.qrcodeBottomLogos}>
            <div className={classes.qrcodeBottomLogoWrapper}>
              <img alt='napas247' src='/logo/NAPAS_247.png' />
            </div>
            <div className={classes.qrcodeBottomLogoWrapper}>
              {
                bank ? <img alt={bank} src={handleRenderBottomLogo()} />
                  : <img alt={bank} src={require('../../../assets/banks/NULL_LOGO.png')} />
              }
            </div>
          </div>
      }
      {
        (error || responseData.qrCodeContent === null) ? null
          : <ul className={classes.accountStatisticsContainer}>
            <li><FormattedMessage {...messages.reference} /></li>
            <li>{!establishConnection ? <div className='loading' /> : reference}</li>
            <li>*<FormattedMessage {...messages.important.remarks} /></li>
            </ul> // eslint-disable-line
      }
      <div className={classes.submitContainer}>
        <GlobalButton
          label='Done'
          color={buttonColor}
          onClick={handleSubmitForm}
          disabled={!establishConnection || loadingButton || error || responseData.qrCodeContent === null}
        />
      </div>
      <p className={classes.importantNote}>{<FormattedMessage {...messages.important.note} />}</p>
      <ol className={classes.importantList}>
        <li>{<FormattedMessage {...messages.important.keyIn} />}</li>
        <li>{<FormattedMessage {...messages.important.noRefresh} />}</li>
        <li>{<FormattedMessage {...messages.important.noSave} />}</li>
      </ol>
    </main>
  )
})

export default QRCodeForm
