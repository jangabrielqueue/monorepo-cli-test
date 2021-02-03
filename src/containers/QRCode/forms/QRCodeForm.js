import React, { memo, useEffect, useState, lazy } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import messages from '../messages'
import { CircularProgress } from '@rmwc/circular-progress'
import QRCode from 'qrcode.react'
import '@rmwc/circular-progress/circular-progress.css'

// lazy loaded components
const GlobalButton = lazy(() => import('../../../components/GlobalButton'))

// styling
const StyledImageContainer = styled.div`
  text-align: center;
`
const StyledSubmitContainer = styled.div`
  margin: 0 auto;
  padding: 25px 0;
  max-width: 230px;
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
const StyledCircularProgress = styled(CircularProgress)`
  && {
    color: ${props => props.theme.colors[props.color.toLowerCase()]};
  }
`

const QRCodeForm = memo(function QRCodeForm (props) {
  const [dynamicLoadBankUtils, setDynamicLoadBankUtils] = useState(null)
  const {
    currency,
    bank,
    establishConnection,
    loadingButton,
    color,
    responseData,
    handleSubmitQRCode,
    error
  } = props
  const isBankKnown = dynamicLoadBankUtils?.checkBankIfKnown(currency, bank)
  const buttonColor = isBankKnown ? `${bank}` : 'main'

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
      <StyledImageContainer>
        {
          !establishConnection ? <StyledCircularProgress size='xlarge' color={color} />
            : error || responseData.decodedImage === null ? null : <QRCode value={responseData.decodedImage} size={200} renderAs='svg' />
        }
      </StyledImageContainer>
      <StyledSubmitContainer>
        <GlobalButton
          label='Done'
          color={buttonColor}
          onClick={handleSubmitForm}
          disabled={!establishConnection || loadingButton || error || responseData.decodedImage === null}
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
