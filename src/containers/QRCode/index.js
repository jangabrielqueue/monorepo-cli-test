import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Logo from '../../components/Logo'
import { checkBankIfKnown } from '../../utils/banks'
import ErrorAlert from '../../components/ErrorAlert'
import { useQuery } from '../../utils/utils'
import AccountStatistics from '../../components/AccountStatistics'
import AutoRedirectRQ from '../../components/AutoRedirectQR'
import QRCodeForm from './QRCodeForm'

const WrapperBG = styled.div`
  background-image: linear-gradient(
    190deg,
    ${(props) => props.theme.colors[`${props.color.toLowerCase()}`]} 44%,
    #ffffff calc(44% + 2px)
  );
  padding-top: ${props => props.bank === 'VCB' ? '105px' : '75px'}
`

const QRCode = (props) => {
  const [step, setStep] = useState(0)
  const [waitingForReady, setWaitingForReady] = useState(false)
  const [error, setError] = useState()
  const [progress, setProgress] = useState()
  const queryParams = useQuery()
  const bank = queryParams.get('b')
  const merchant = queryParams.get('m')
  const currency = queryParams.get('c1')
  const requester = queryParams.get('c2')
  const clientIp = queryParams.get('c3')
  const callbackUri = queryParams.get('c4')
  const amount = queryParams.get('a')
  const reference = queryParams.get('r')
  const datetime = queryParams.get('d')
  const signature = queryParams.get('k')
  const successfulUrl = queryParams.get('su')
  const failedUrl = queryParams.get('fu')
  const note = queryParams.get('n')
  const language = props.language // language was handled at root component not at the queryparams
  const isBankKnown = checkBankIfKnown(currency, bank)
  const themeColor = isBankKnown ? `${bank}` : 'main'

  return (
    <WrapperBG className='wrapper' bank={bank} color={themeColor}>
      <div className='container'>
        <div className='form-content'>
          <header className={step === 1 ? null : 'header-bottom-border'}>
            <Logo bank={bank} currency={currency} />
            {step === 0 && (
              <AccountStatistics
                accountName='Name'
                language={language}
                currency={currency}
                amount={amount}
              />
            )}
          </header>
          {step === 0 && (
            <AutoRedirectRQ delay={180000} setStep={setStep} step={step}>
              <QRCodeForm
                currency={currency}
                bank={bank}
                waitingForReady={waitingForReady}
              />
            </AutoRedirectRQ>
          )}
        </div>
      </div>
    </WrapperBG>
  )
}

export default QRCode
