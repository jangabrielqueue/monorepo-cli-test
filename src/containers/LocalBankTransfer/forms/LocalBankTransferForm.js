import React, { lazy, memo } from 'react'
// import { FormattedMessage } from 'react-intl'
// import messages from '../messages'
import { createUseStyles } from 'react-jss'
import { checkBankIfKnown } from '../../../utils/banks'

// lazy loaded components
const GlobalButton = lazy(() => import('../../../components/GlobalButton'))

// styling
const useStyles = createUseStyles({
  localBankTransferFormWrapper: {
    marginBottom: 20
  },
  localBankTransferFormContainer: {
    listStyle: 'none',
    margin: '0 0 20px 0',
    padding: 0,

    '& li': {
      display: 'flex',
      fontSize: '16px',
      fontWeight: '400',
      margin: '0 0 4px',

      '& span': {
        color: '#3f3f3f',
        fontFamily: 'ProductSansBold',
        height: '20px',
        marginLeft: '10px',
        minWidth: '20px'
      }
    }
  },
  submitContainer: {
    margin: '0 auto',
    padding: '25px 0',
    maxWidth: '230px'
  }
})

const LocalBankTransferForm = memo((props) => {
  const {
    currency,
    bank,
    establishConnection,
    loadingButton,
    responseData,
    handleSubmitLocalBankTransfer,
    error
  } = props
  const isBankKnown = checkBankIfKnown(currency, bank)
  const buttonColor = isBankKnown ? `${bank}` : 'main'
  const classes = useStyles()

  function handleSubmitForm () {
    handleSubmitLocalBankTransfer()
  }

  return (
    <main className={classes.localBankTransferFormWrapper}>
      <ul className={classes.localBankTransferFormContainer}>
        <li>Bank Name: <span>{!establishConnection ? <div className='loading' /> : responseData.bankName}</span></li>
        <li>Bank Account Name: <span>{!establishConnection ? <div className='loading' /> : responseData.accountName}</span></li>
        <li>Bank Account Number: <span>{!establishConnection ? <div className='loading' /> : responseData.accountNumber}</span></li>
        <li>Amount: <span>{!establishConnection ? <div className='loading' /> : responseData.amount}</span></li>
      </ul>
      <div className={classes.submitContainer}>
        <GlobalButton
          label='OK'
          color={buttonColor}
          onClick={handleSubmitForm}
          disabled={!establishConnection || loadingButton || error || responseData.decodedImage === null}
        />
      </div>
    </main>
  )
})

export default LocalBankTransferForm
