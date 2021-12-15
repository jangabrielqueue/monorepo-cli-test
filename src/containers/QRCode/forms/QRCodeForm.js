import React, { memo, lazy } from 'react'
import { FormattedMessage } from 'react-intl'
import messages from '../messages'
import QRCode from 'qrcode.react'
import { createUseStyles } from 'react-jss'
import { checkBankIfKnown } from '../../../utils/banks'

// lazy loaded components
const GlobalButton = lazy(() => import('../../../components/GlobalButton'))

// styling
const useStyles = createUseStyles({
  imageContainer: {
    textAlign: 'center'
  },
  submitContainer: {
    margin: '0 auto',
    padding: '25px 0',
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
    error
  } = props
  const isBankKnown = checkBankIfKnown(currency, bank)
  const buttonColor = isBankKnown ? `${bank}` : 'main'
  const classes = useStyles()

  function handleSubmitForm () {
    handleSubmitQRCode()
  }

  return (
    <main>
      <div className={classes.imageContainer}>
        {
          !establishConnection ? <div className='loading' />
            : error || responseData.qrCodeContent === null ? null : <QRCode value={responseData.qrCodeContent} size={200} renderAs='svg' />
        }
      </div>
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
