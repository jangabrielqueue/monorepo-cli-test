import React, { memo, lazy } from 'react'
import { FormattedMessage } from 'react-intl'
import messages from '../messages'
import QRCode from 'qrcode.react'
import { createUseStyles } from 'react-jss'
import { checkBankIfKnown, checkIfVndCurrency } from '../../../utils/banks'

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
    alignItems: 'center',
    margin: '10px 0',

    '& img': {
      height: 'auto',
      maxWidth: '120px',
      width: '100%',

      '&:first-child': {
        borderRight: '2px solid #1b427f'
      },

      '&:last-child': {
        paddingLeft: '15px'
      }
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
  const isBankKnown = checkBankIfKnown(currency, bank)
  const buttonColor = isBankKnown ? `${bank}` : 'main'
  const classes = useStyles({ currency })

  function handleSubmitForm () {
    handleSubmitQRCode()
  }

  return (
    <main>
      {
        <div className={classes.qrCodeContainer}>
          <h1><span>{`${new Intl.NumberFormat(language).format(responseData.amount)}`}</span></h1>
          {
            !establishConnection ? <div className='loading' />
              : error || responseData.qrCodeContent === null ? null : <QRCode
                value={responseData.qrCodeContent}
                size={200}
                renderAs='svg'
                imageSettings={{
                  src: '/logo/GW_LOGO_ICON.webp',
                  x: null,
                  y: null,
                  height: 40,
                  width: 40,
                  excavate: true
                }}
                /> // eslint-disable-line
          }
        </div>
      }
      {
        checkIfVndCurrency(currency) &&
          <div className={classes.qrcodeBottomLogos}>
            <img alt='napas247' src='/logo/NAPAS_247.webp' />
            <img alt={bank} src={require(`../../../assets/banks/${bank}_LOGO.webp`)} />
          </div>
      }
      {
        (error || responseData.qrCodeContent === null) ? null
          : <ul className={classes.accountStatisticsContainer}>
            <li><FormattedMessage {...messages.remark} /></li>
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
