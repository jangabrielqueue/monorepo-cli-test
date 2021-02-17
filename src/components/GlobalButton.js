/* eslint-disable */
import React from 'react'
import { renderButtonColors } from '../utils/utils'
import { createUseStyles, useTheme } from 'react-jss'

// styling
const useStyles = createUseStyles({
  outlinedButton: {
    alignItems: 'center',
    backgroundColor: ({ props, theme }) => props.topup === true ? theme.colors[props.color?.toLowerCase()] : 'transparent',
    borderRadius: '8px',
    border: ({ props, theme }) => props.topup === true ? 0 : `2px solid ${theme.colors[props.color?.toLowerCase()]}`,
    color: ({ props, theme }) => props.topup === true ? '#FFF' : theme.colors[props.color?.toLowerCase()],
    display: 'flex',
    fontFamily: 'ProductSansBold',
    fontSize: '14px',
    height: '43px',
    justifyContent: 'space-evenly',
    letterSpacing: '1.5px',
    lineHeight: 0.5,
    margin: '10px',
    maxWidth: '155px',
    width: '100%',

    '&:disabled': {
      opacity: '0.5'
    },

    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#F5F5F5'
    },

    '@media (max-width: 23.438em)': {
      maxWidth: '130px',
      padding: 0
    }
  },
  fillButton: {
    alignItems: 'center',
    backgroundColor: ({ props, theme }) => theme.colors[renderButtonColors(props.bank, props.color)],
    borderRadius: '11px',
    border: 0,
    color: [['#fff'], '!important'],
    display: 'flex',
    fontFamily: 'ProductSansMedium',
    fontSize: '18px',
    height: '50px',
    justifyContent: 'center',
    padding: '0 20px',
    position: 'relative',
    textTransform: 'capitalize',
    width: '100%',

    '&:disabled': {
      opacity: '0.5'
    },

    '&:hover': {
      cursor: 'pointer',
      opacity: '0.7'
    },

    '& img': {
      left: '30px',
      position: 'absolute'
    }
  }
})

const GlobalButton = (props) => {
  const { label, children, onClick } = props
  const theme = useTheme()
  const classes = useStyles({ props, theme })

  return (
    <>
      {
        props.outlined
          ? <button className={classes.outlinedButton} onClick={onClick}>
            {children}
            {label}
            </button>
          : <button className={classes.fillButton}>
            {children}
            {label}
            </button>
      }
    </>
  )
}

export default GlobalButton
