import React, { lazy, memo } from 'react'
import { FormattedMessage } from 'react-intl'
import messages from '../messages'
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
      <h1 className={classes.localBankTransferHeadingText}><FormattedMessage {...messages.localBanktransfer.kindleAssureToDepositExactAmount} /></h1>
      <ul className={classes.localBankTransferFormContainer}>
        <li><FormattedMessage {...messages.localBanktransfer.bankName} /> <span>{!establishConnection ? <div className='loading' /> : responseData.data?.bank || 'N/A'}</span></li>
        <li><FormattedMessage {...messages.localBanktransfer.accountName} /> <span>{!establishConnection ? <div className='loading' /> : responseData.data?.customer || 'N/A'}</span></li>
        <li><FormattedMessage {...messages.localBanktransfer.accountNumber} /> <span>{!establishConnection ? <div className='loading' /> : responseData.data?.accountNumber || 'N/A'}</span></li>
        <li><FormattedMessage {...messages.localBanktransfer.amount} /> <span>{!establishConnection ? <div className='loading' /> : responseData.data?.amount || 'N/A'}</span></li>
      </ul>
      <div className={classes.submitContainer}>
        <GlobalButton
          label='OK, transfer done'
          color={buttonColor}
          onClick={handleSubmitForm}
          disabled={!establishConnection || loadingButton || error || responseData.data === null}
        />
      </div>
    </main>
  )
})

export default LocalBankTransferForm
