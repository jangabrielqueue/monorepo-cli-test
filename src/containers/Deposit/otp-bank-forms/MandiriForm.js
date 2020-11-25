import React, { memo } from 'react'
import messages from '../messages'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import GlobalButton from '../../../components/GlobalButton'

const StyledHeader = styled.h1`
  font-size: 16px;
  font-weight: normal;
  margin: 0 0 20px;
`
const StyledSubHeader = styled.h2`
  font-size: 14px;
  font-weight: normal;
  margin: 0;
`
const StyledReference = styled.p`
  align-items: center;
  display: flex;
  font-size: 14px;
  height: 100px;
  margin: 0;
`

const MandiriForm = memo(function MandiriForm (props) {
  const { waitingForReady, handleSubmitOTP, bank, otpReference } = props

  function handleSubmitForm () {
    // submit 'DONE' as OTP value
    handleSubmitOTP('DONE')
  }

  return (
    <main>
      <StyledHeader><FormattedMessage {...messages.pleaseUseMandiri} /></StyledHeader>
      <StyledSubHeader><FormattedMessage {...messages.clickDone} /></StyledSubHeader>
      <StyledReference>Ref: {otpReference}</StyledReference>
      <GlobalButton
        label={<FormattedMessage {...messages.done} />}
        color='MANDIRI'
        icon={<img alt='submit' src={require('../../../assets/icons/submit-otp.svg')} />}
        onClick={handleSubmitForm}
        disabled={waitingForReady}
        bank={bank && bank.toUpperCase()}
      />
    </main>
  )
})

export default MandiriForm
