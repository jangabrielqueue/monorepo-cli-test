import React, { memo } from 'react'
import { createUseStyles } from 'react-jss'
import { checkBankIfKnown, checkIfMomoBank, checkIfZaloBank } from '../utils/banks'

// styling
const useStyles = createUseStyles({
  logoContainer: {
    margin: ({ noMargin }) => noMargin ? '0' : '25px auto',
    maxWidth: ({ bank, type }) => bank?.toUpperCase() === 'PRECARD' &&
    type === 'scratch-card' ? '400px' : '200px',

    '& img': {
      height: 'auto'
    },

    '@media (max-width: 36em) and (orientation: portrait)': {
      margin: '10px auto',
      maxWidth: ({ bank, type }) => bank?.toUpperCase() === 'PRECARD' &&
      type === 'scratch-card' ? '400px' : '150px'
    }
  }
})

const Logo = ({ bank, currency, type, width = '200', height = '80', noMargin }) => {
  const requestImageFileWebp = require.context('../assets/banks', true, /^\.\/.*\.png$/)
  const isBankKnown = checkBankIfKnown(currency, bank)
  const classes = useStyles({ bank, type, noMargin })
  const bankIsMomoOrZalo = checkIfZaloBank(bank) || checkIfMomoBank(bank)

  const getFilePathWebP = (bank, type) => {
    if (isBankKnown) {
      return requestImageFileWebp(`./${bank.toUpperCase()}_LOGO.png`)
    } else if (bank?.toUpperCase() === 'PRECARD' && type === 'scratch-card') {
      return requestImageFileWebp('./PRECARD_LOGO.png')
    } else {
      return requestImageFileWebp('./GW_LOGO.png')
    }
  }

  return (
    <section className={classes.logoContainer}>
      {
        isBankKnown !== undefined && // all repo except topup
          <img
            alt={bank}
            style={{ ...bankIsMomoOrZalo ? { transform: 'scale(calc(2 / 3))', margin: '-20px auto' } : {} }}
            width={(bank?.toUpperCase() === 'PRECARD' && type === 'scratch-card') ? '400' : width}
            height={(bank?.toUpperCase() === 'PRECARD' && type === 'scratch-card') ? '120' : height}
            src={getFilePathWebP(bank, type)}
          />
      }
      {
        isBankKnown === undefined && type === 'topup' && // for topup logo only
          <img
            alt={bank}
            width={(bank?.toUpperCase() === 'PRECARD' && type === 'scratch-card') ? '400' : width}
            height={(bank?.toUpperCase() === 'PRECARD' && type === 'scratch-card') ? '120' : height}
            src={getFilePathWebP(bank, type)}
          />
      }
      {
        isBankKnown === undefined && type === undefined && // without bank param
          <img
            alt='game-wallet'
            width={width}
            height={height}
            src={requestImageFileWebp('./GW_LOGO.png')}
          />
      }
    </section>
  )
}

export default memo(Logo)
