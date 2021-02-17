import React, { memo, useContext, lazy } from 'react'
import messages from '../messages'
import { FormattedMessage } from 'react-intl'
import { createUseStyles } from 'react-jss'
import { QueryParamsContext } from '../../../contexts/QueryParamsContext'

// lazy loaded components
const GlobalButton = lazy(() => import('../../../components/GlobalButton'))

// styling
const useStyles = createUseStyles({
  header: {
    fontSize: '16px',
    fontWeight: 'normal',
    margin: '0 0 20px'
  },

  subHeader: {
    fontSize: '14px',
    fontWeight: 'normal',
    margin: 0
  },
  reference: {
    alignItems: 'center',
    display: 'flex',
    fontSize: '14px',
    height: '100px',
    margin: 0
  }
},
{ name: 'Mandiri' }
)

const MandiriForm = memo(function MandiriForm (props) {
  const {
    bank
  } = useContext(QueryParamsContext)
  const { waitingForReady, handleSubmitOTP, otpReference } = props
  const classes = useStyles()

  function handleSubmitForm () {
    // submit 'DONE' as OTP value
    handleSubmitOTP('DONE')
  }

  return (
    <>
      <h1 className={classes.header}><FormattedMessage {...messages.pleaseUseMandiri} /></h1>
      <h2 className={classes.subHeader}><FormattedMessage {...messages.clickDone} /></h2>
      <p className={classes.reference}>Ref: {otpReference}</p>
      <GlobalButton
        label={<FormattedMessage {...messages.done} />}
        color='MANDIRI'
        onClick={handleSubmitForm}
        disabled={waitingForReady}
        bank={bank && bank.toUpperCase()}
      >
        <img alt='submit' width='24' height='24' src='/icons/submit-otp.svg' />
      </GlobalButton>
    </>
  )
})

export default MandiriForm
