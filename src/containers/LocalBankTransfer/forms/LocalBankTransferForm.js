import React, { lazy, memo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import messages from '../messages'
import { createUseStyles } from 'react-jss'
import { checkBankIfKnown } from '../../../utils/banks'
import { ReactComponent as CopyIcon } from '../../../assets/icons/copy-icon.svg'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import classNames from 'classnames/bind'

// lazy loaded components
const GlobalButton = lazy(() => import('../../../components/GlobalButton'))

// styling
const useStyles = createUseStyles({
  localBankTransferHeadingText: {
    fontSize: '14px',
    margin: 0
  },
  tableContainer: {
    width: '100%',
    borderSpacing: '5px',

    '& > tbody > tr > td': {
      '&:nth-child(odd)': {
        paddingRight: '10px',
        textAlign: 'right',
        verticalAlign: 'top',
        width: '120px'
      },
      '&:nth-child(even)': {
        fontWeight: '600',
        textAlign: 'justify',
        wordBreak: 'break-all'
      }
    },

    '& > tbody > tr:last-child > td:last-child': {
      position: 'relative'
    },

    '@media (max-width: 36em)': {
      '& > tbody > tr > td': {
        '&:nth-child(odd)': {
          width: '115px !important'
        }
      }
    }
  },
  amountContainer: {
    padding: '15px 0',
    textAlign: 'center',

    '& h2': {
      margin: 0,

      '& span': {
        display: 'inline-block'
      }
    }
  },

  toolTipText: {
    backgroundColor: '#555',
    borderRadius: '6px',
    bottom: '125%',
    color: '#fff',
    fontSize: '14px',
    left: '50%',
    marginLeft: '-80px',
    padding: '8px 0',
    position: 'absolute',
    textAlign: 'center',
    visibility: 'hidden',
    width: '90px',
    zIndex: 1,

    '&::after': {
      borderColor: '#555 transparent transparent transparent',
      borderStyle: 'solid',
      borderWidth: '5px',
      content: '""',
      left: '50%',
      marginLeft: '-5px',
      position: 'absolute',
      top: '100%'
    }
  },

  toolTipShow: {
    '-webkit-animation': 'fadeIn 1s',
    animation: 'fadeIn 1s',
    visibility: 'visible'
  },

  copyIcon: {
    height: '20px',
    width: '20px',
    cursor: 'pointer',
    verticalAlign: 'text-bottom',
    margin: '0 5px'
  },

  hideCopyIcon: {
    display: 'none'
  },

  submitContainer: {
    margin: '0 auto',
    padding: '25px 0',
    maxWidth: '300px'
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
  const cx = classNames.bind(classes)
  const [isCopy, setIsCopy] = useState(false)

  const toolTipStyles = cx({
    toolTipText: true,
    toolTipShow: isCopy
  })
  const copyIconStyles = cx({
    hideCopyIcon: !establishConnection || loadingButton || error || responseData.data === null,
    copyIcon: true
  })

  function handleSubmitForm () {
    handleSubmitLocalBankTransfer()
  }

  return (
    <main>
      <h1 className={classes.localBankTransferHeadingText}><FormattedMessage {...messages.localBanktransfer.kindleAssureToDepositExactAmount} /></h1>
      <div className={classes.amountContainer}>
        <h2>{currency} <span>{!establishConnection ? <div className='loading' /> : responseData.data?.amount}</span></h2>
      </div>
      <table className={classes.tableContainer}>
        <tbody>
          <tr>
            <td><FormattedMessage {...messages.localBanktransfer.bankName} /></td>
            <td>{!establishConnection ? <div className='loading' /> : responseData.data?.bank}</td>
          </tr>
          <tr>
            <td><FormattedMessage {...messages.localBanktransfer.accountName} /></td>
            <td>{!establishConnection ? <div className='loading' /> : responseData.data?.customer}</td>
          </tr>
          <tr>
            <td><FormattedMessage {...messages.localBanktransfer.accountNumber} /></td>
            <td>{!establishConnection ? <div className='loading' /> : responseData.data?.accountNumber}
              <span className={toolTipStyles}>Copied!</span>
              <CopyToClipboard text={responseData.data?.accountNumber} onCopy={() => setIsCopy(prevState => !prevState)}>
                <CopyIcon className={copyIconStyles} />
              </CopyToClipboard>
            </td>
          </tr>
        </tbody>
      </table>
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
