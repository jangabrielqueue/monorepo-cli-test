import React, { memo } from 'react'
import { createUseStyles } from 'react-jss'
import { checkBankIfKnown } from '../utils/banks'

// styling
const useStyles = createUseStyles({
  logoContainer: {
    margin: '25px auto',
    maxWidth: ({ bank, type }) => bank?.toUpperCase() === 'PRECARD' &&
    type === 'scratch-card' ? '400px' : '200px',

    '& img': {
      height: 'auto',
      width: '100%'
    },

    '@media (max-width: 36em) and (orientation: portrait)': {
      margin: '10px auto',
      maxWidth: ({ bank, type }) => bank?.toUpperCase() === 'PRECARD' &&
      type === 'scratch-card' ? '400px' : '150px'
    }
  }
})

const Logo = ({ bank, currency, type }) => {
  const requestImageFileWebp = require.context('../assets/banks', true, /^\.\/.*\.png$/)
  const isBankKnown = checkBankIfKnown(currency, bank)
  const classes = useStyles({ bank, type })

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
            width={(bank?.toUpperCase() === 'PRECARD' && type === 'scratch-card') ? '400' : '200'}
            height={(bank?.toUpperCase() === 'PRECARD' && type === 'scratch-card') ? '120' : '80'}
            src={getFilePathWebP(bank, type)}
          />
      }
      {
        isBankKnown === undefined && type === 'topup' && // for topup logo only
          <img
            alt={bank}
            width={(bank?.toUpperCase() === 'PRECARD' && type === 'scratch-card') ? '400' : '200'}
            height={(bank?.toUpperCase() === 'PRECARD' && type === 'scratch-card') ? '120' : '80'}
            src={getFilePathWebP(bank, type)}
          />
      }
      {
        isBankKnown === undefined && type === undefined && // without bank param
          <img
            alt='game-wallet'
            width='200'
            height='80'
            src={requestImageFileWebp('./GW_LOGO.png')}
          />
      }
    </section>
  )
}

export default memo(Logo)
