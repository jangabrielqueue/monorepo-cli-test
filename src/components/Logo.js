import React, { memo, useEffect, useState } from 'react'
import styled from 'styled-components'

// styling
const StyledLogoContainer = styled.section`
  margin: 25px auto;
  max-width: ${props => props.bank?.toUpperCase() === 'PRECARD' &&
  props.type === 'scratch-card' ? '400px' : '200px'
  };

  > img {
    height: auto;
    width: 100%;
  }
`

const Logo = ({ bank, currency, type }) => {
  const [dynamicLoadBankUtils, setDynamicLoadBankUtils] = useState(null)
  const requestImageFileWebp = require.context('../assets/banks', true, /^\.\/.*\.webp$/)

  const getFilePathWebP = (bank, currency, type) => {
    const isBankKnown = dynamicLoadBankUtils?.checkBankIfKnown(currency, bank)

    if (isBankKnown) {
      return requestImageFileWebp(`./${bank.toUpperCase()}_LOGO.webp`)
    } else if (bank?.toUpperCase() === 'PRECARD' && type === 'scratch-card') {
      return requestImageFileWebp('./PRECARD_LOGO.webp')
    }

    return requestImageFileWebp('./GW_LOGO.webp')
  }

  useEffect(() => {
    async function dynamicLoadModules () { // dynamically load bank utils
      const { checkBankIfKnown } = await import('../utils/banks')
      setDynamicLoadBankUtils({
        checkBankIfKnown
      })
    }

    dynamicLoadModules()
  }, [])

  return (
    <StyledLogoContainer bank={bank} type={type}>
      <img
        alt={bank}
        width={(bank?.toUpperCase() === 'PRECARD' && type === 'scratch-card') ? '400' : '200'}
        height={(bank?.toUpperCase() === 'PRECARD' && type === 'scratch-card') ? '400' : '200'}
        src={getFilePathWebP(bank, currency, type)}
      />
    </StyledLogoContainer>
  )
}

export default memo(Logo)
