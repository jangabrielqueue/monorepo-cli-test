import React, { memo } from 'react'
import styled from 'styled-components'
import GlobalButton from '../../components/GlobalButton'
import { checkBankIfKnown } from '../../utils/banks'
import { FormattedMessage } from 'react-intl'
import messages from './messages'

const StyledQRImage = styled.img`
  height: auto;
  max-width: 100%;
`
const StyledImageContainer = styled.div`
  text-align: center;
`
const StyledSubmitContainer = styled.div`
  margin: 0 auto;
  padding: 25px 0;
  max-width: 320px;
`
const StyledImportantNote = styled.p`
  color: #3f3f3f;
  font-family: ProductSansBold;
  font-size: 14px;
  margin: 0 0 10px;
`
const StyledImportantList = styled.ol`
  font-size: 14px;
  margin: 0;
  padding: 0 0 0 15px;
`

const QRCodeForm = memo(function QRCodeForm (props) {
  const {
    currency,
    bank,
    waitingForReady
  } = props
  const isBankKnown = checkBankIfKnown(currency, bank)
  const buttonColor = isBankKnown ? `${bank}` : 'main'

  function handleSubmitForm () {
    console.log('trigger')
  }

  return (
    <main>
      <StyledImageContainer>
        <StyledQRImage src='https://via.placeholder.com/300.jpeg' alt='qr-code' />
      </StyledImageContainer>
      <StyledSubmitContainer>
        <GlobalButton
          label='Done'
          color={buttonColor}
          onClick={handleSubmitForm}
          disabled={waitingForReady}
        />
      </StyledSubmitContainer>
      <StyledImportantNote>{<FormattedMessage {...messages.important.note} />}</StyledImportantNote>
      <StyledImportantList>
        <li>{<FormattedMessage {...messages.important.keyIn} />}</li>
        <li>{<FormattedMessage {...messages.important.noRefresh} />}</li>
        <li>{<FormattedMessage {...messages.important.noSave} />}</li>
      </StyledImportantList>
    </main>
  )
})

export default QRCodeForm
