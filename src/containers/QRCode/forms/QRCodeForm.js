import React, { memo, useEffect, useState, lazy } from 'react'
import { FormattedMessage } from 'react-intl'
import messages from '../messages'
import QRCode from 'qrcode.react'
import { createUseStyles } from 'react-jss'

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
  const [dynamicLoadBankUtils, setDynamicLoadBankUtils] = useState(null)
  const {
    currency,
    bank,
    establishConnection,
    loadingButton,
    responseData,
    handleSubmitQRCode,
    error
  } = props
  const isBankKnown = dynamicLoadBankUtils?.checkBankIfKnown(currency, bank)
  const buttonColor = isBankKnown ? `${bank}` : 'main'
  const classes = useStyles()

  function handleSubmitForm () {
    handleSubmitQRCode()
  }

  useEffect(() => {
    async function dynamicLoadModules () { // dynamically load bank utils
      const { checkBankIfKnown } = await import('../../../utils/banks')
      setDynamicLoadBankUtils({
        checkBankIfKnown
      })
    }

    dynamicLoadModules()
  }, [])

  return (
    <main>
      <div className={classes.imageContainer}>
        {
          !establishConnection ? <div className='loading' />
            : error || responseData.decodedImage === null ? null : <QRCode value={responseData.decodedImage} size={200} renderAs='svg' />
        }
      </div>
      <div className={classes.submitContainer}>
        <GlobalButton
          label='Done'
          color={buttonColor}
          onClick={handleSubmitForm}
          disabled={!establishConnection || loadingButton || error || responseData.decodedImage === null}
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
