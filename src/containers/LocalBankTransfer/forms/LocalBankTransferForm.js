import React, { lazy, memo } from 'react'
// import { FormattedMessage } from 'react-intl'
// import messages from '../messages'
import { createUseStyles } from 'react-jss'
import { checkBankIfKnown } from '../../../utils/banks'

// lazy loaded components
const GlobalButton = lazy(() => import('../../../components/GlobalButton'))

// styling
const useStyles = createUseStyles({
  localBankTransferHeadingText: {
    fontSize: '14px',
    margin: '0 0 20px 0',
    fontWeight: '600'
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
        marginLeft: 'auto',
        minWidth: '60%',
        textTransform: 'capitalize',
        position: 'relative',

        '& .loading': {
          position: 'static'
        },

        '&:before': {
          content: '":"',
          marginRight: '10px'
        }
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
    <main>
      <h1 className={classes.localBankTransferHeadingText}>Kindly assure to deposit the exact amount stated below for a smooth procedure.</h1>
      <ul className={classes.localBankTransferFormContainer}>
        <li>Bank Name <span>{!establishConnection ? <div className='loading' /> : responseData?.bankName || 'N/A'}</span></li>
        <li>Account Name <span>{!establishConnection ? <div className='loading' /> : responseData?.accountName || 'N/A'}</span></li>
        <li>Account No. <span>{!establishConnection ? <div className='loading' /> : responseData?.accountNumber || 'N/A'}</span></li>
        <li>Amount <span>{!establishConnection ? <div className='loading' /> : responseData?.amount || 'N/A'}</span></li>
      </ul>
      <div className={classes.submitContainer}>
        <GlobalButton
          label='OK, transfer done'
          color={buttonColor}
          onClick={handleSubmitForm}
          disabled={!establishConnection || loadingButton || error || responseData === null}
        />
      </div>
    </main>
  )
})

export default LocalBankTransferForm
