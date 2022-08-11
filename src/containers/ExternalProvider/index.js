import React, { useContext } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { FormattedMessage } from 'react-intl'
import { createUseStyles } from 'react-jss'
import { FallbackComponent } from '../../components/FallbackComponent'
import { QueryParamsValidator } from '../../components/QueryParamsValidator'
import { FirebaseContext } from '../../contexts/FirebaseContext'
import { QueryParamsContext } from '../../contexts/QueryParamsContext'
import messages from './messages'
// import GlobalButton from '../../components/GlobalButton'
// import { checkBankIfKnown } from '../../utils/banks'
// import classNames from 'classnames/bind'

const useStyles = createUseStyles({
  formWrapper: {
    height: '100%',
    minWidth: '500px',
    padding: '75px 0 0',

    '@media (max-width: 62em)': {
      padding: (props) => props.bank?.toUpperCase() === 'BIDV' && '0 20px'
    },

    '@media (max-width: 36em)': {
      minWidth: 0,
      overflowY: 'scroll',
      maxHeight: 'calc(100vh - 83px)'
    },

    '@media (max-width: 33.750em)': {
      padding: '35px 20px 0'
    }
  },
  container: {
    margin: '0 auto',
    maxWidth: '466px'
  },
  content: {
    background: '#FFFFFF',
    borderRadius: '15px',
    boxShadow: '0px 5px 10px 0px rgba(112,112,112,0.3)'
  },
  headerContainer: {
    padding: '10px 20px',
    borderBottom: (props) => props.step !== 2 ? '0.5px solid #E3E3E3' : '#FFF',
    '& h1': {
      textAlign: 'center'
    }

  },
  contentBody: {
    padding: '20px',
    position: 'relative'
  },
  submitContainer: {
    margin: '0 auto',
    padding: '20px 0',
    maxWidth: '230px'
  },
  formContainer: {
    display: 'flex',

    '&:before': {
      content: '""',
      display: 'block',
      height: '20px',
      margin: '15px 15px 0 0',
      width: '20px'
    },

    '& div': {
      flex: '0 1 425px'
    }
  },
  inputFieldContainer: {
    position: 'relative',

    '& ul': {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between',
      listStyle: 'none',
      margin: 0,
      padding: 0,
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 'auto',

      '& li:nth-child(odd)': {
        height: '14px',
        width: '14px',
        margin: 0,

        '& span': {
          alignItems: 'center',
          background: '#C0C0C0',
          borderRadius: '50%',
          color: '#FFF',
          cursor: 'pointer',
          display: 'flex',
          fontSize: '16px',
          height: '100%',
          justifyContent: 'center',
          lineHeight: 1.5,
          width: '100%'
        }
      },

      '& li:nth-child(even)': {
        cursor: 'pointer',
        height: '16px',
        width: '16px',
        margin: 0,

        '& img': {
          width: '100%',
          height: '100%'
        }
      }
    }
  },
  inputFieldContainerPassword: {
    '& ul': {
      width: [['40px'], '!important']
    }
  }
})

const headerCases = {
  PENDING: messages.header.pending,
  FAILED: messages.header.failed,
  SUCCESS: messages.header.success
}
const ExternalProvider = () => {
  const {
    bank
    // merchant,
    // currency
    // requester,
    // clientIp,
    // callbackUri,
    // amount,
    // reference,
    // datetime,
    // signature,
    // successfulUrl,
    // failedUrl,
    // note
  } = useContext(QueryParamsContext)
  const queryParams = useContext(QueryParamsContext)
  const analytics = useContext(FirebaseContext)
  const classes = useStyles({ bank })
  const transactionProgress = 'PENDING'
  function errorHandler (error, componentStack) {
    analytics.logEvent('exception', {
      stack: componentStack,
      description: error,
      fatal: true
    })
  }

  return (
    <ErrorBoundary onError={errorHandler} FallbackComponent={FallbackComponent}>
      <QueryParamsValidator />
      <div className={classes.formWrapper}>
        <div className={classes.container}>
          <div className={classes.content}>
            <section className={classes.headerContainer}>
              <h1><FormattedMessage {...headerCases[transactionProgress]} /></h1>
            </section>
            <section className={classes.contentBody}>
              {JSON.stringify(queryParams, null, 2)}
            </section>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default ExternalProvider
