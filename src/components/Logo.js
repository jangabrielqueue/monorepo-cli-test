import React from 'react'
import { checkBankIfKnown } from '../utils/banks'

const getFilePathWebP = (bank, currency, type) => {
  const isBankKnown = checkBankIfKnown(currency, bank)

  if (isBankKnown) {
    return require(`../assets/banks/${bank.toUpperCase()}_LOGO.webp`)
  } else if (bank === 'PRECARD' && type === 'scratch-card') {
    return require('../assets/banks/PRECARD_LOGO.webp')
  }

  return require('../assets/banks/GW_LOGO.webp')
}

const getFilePathPng = (bank, currency, type) => {
  const isBankKnown = checkBankIfKnown(currency, bank)

  if (isBankKnown) {
    return require(`../assets/banks/${bank.toUpperCase()}_LOGO.png`)
  } else if (bank === 'PRECARD' && type === 'scratch-card') {
    return require('../assets/banks/PRECARD_LOGO.png')
  }

  return require('../assets/banks/GW_LOGO.png')
}

const Logo = ({ bank, currency, type }) => {
  return (
    <section className='logo'>
      <picture>
        <source type='image/webp' srcSet={getFilePathWebP(bank, currency, type)} />
        <source type='image/png' srcSet={getFilePathPng(bank, currency, type)} />
        <img alt={bank} src={getFilePathPng(bank, currency, type)} />
      </picture>
    </section>
  )
}

export default Logo
