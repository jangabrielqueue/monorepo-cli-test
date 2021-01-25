import React from 'react'
import { useQuery } from '../utils/utils'
import { checkBankIfKnown } from '../utils/banks'
import styled from 'styled-components'

const WrapperBG = styled.div`
  background-image: linear-gradient(
    190deg,
    ${(props) => props.theme.colors[`${props.color.toLowerCase()}`]} 44%,
    #ffffff calc(44% + 2px)
  );
  padding-top: ${props => props.bank && props.bank.toUpperCase() === 'VCB' ? '105px' : '75px'};

  @media (max-width: 33.750em) {
    padding-top: ${props => props.bank && props.bank.toUpperCase() !== 'VCB' && '35px'};
  }
`

const FallbackPage = () => {
  const queryParams = useQuery()
  const bank = queryParams.get('b')
  const currency = queryParams.get('c1')
  const isBankKnown = checkBankIfKnown(currency, bank)
  const themeColor = isBankKnown ? `${bank}` : 'main'

  return (
    <WrapperBG className='wrapper' bank={bank} color={themeColor}>
      <div className='container'>
        <div className='form-content'>
          <div className='fallback-container' />
        </div>
      </div>
    </WrapperBG>
  )
}

export default FallbackPage
