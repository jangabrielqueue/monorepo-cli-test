import React, { memo, lazy, useContext, useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import QRCode from 'qrcode.react'
import { FormattedMessage } from 'react-intl'
import messages from '../messages'
import { QueryParamsContext } from '../../../contexts/QueryParamsContext'

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

export default memo(function OTPBidvForm () {
  const {
    bank,
    currency
  } = useContext(QueryParamsContext)
  const [dynamicLoadUtils, setDynamicLoadUtils] = useState(null)
  const isBankKnown = dynamicLoadUtils?.checkBankIfKnown(currency, bank)
  const buttonColor = isBankKnown ? `${bank}` : 'main'
  const classes = useStyles()

  function handleSubmitForm () {

  }

  useEffect(() => {
    async function dynamicLoadModules () { // dynamically load bank utils
      const { checkBankIfKnown } = await import('../../../utils/banks')
      setDynamicLoadUtils({
        checkBankIfKnown
      })
    }

    dynamicLoadModules()
  }, [])

  return (
    <>
      <div className={classes.imageContainer}>
        <QRCode value='00020101021502020103069704180404BIDV07205AD93386770E47299' size={200} renderAs='svg' />
      </div>
      <div className={classes.submitContainer}>
        <GlobalButton
          label='Done'
          color={buttonColor}
          onClick={handleSubmitForm}
          disabled
        />
      </div>
      <p className={classes.importantNote}>{<FormattedMessage {...messages.important.note} />}</p>
      <ol className={classes.importantList}>
        <li>{<FormattedMessage {...messages.important.keyIn} />}</li>
        <li>{<FormattedMessage {...messages.important.noRefresh} />}</li>
        <li>{<FormattedMessage {...messages.important.noSave} />}</li>
      </ol>
    </>
  )
})
