import { render } from '@testing-library/react'
import { cardOtpErrorMessageRender, inputLabelRender, methodTypeRender, notCardOtpErrorMessagesRender } from './OTPForm'

describe('OTP method renders', () => {
  test('should render when no OTP method', () => {
    const props = {
      methodType: undefined,
      otpReference: '41728123',
      classes: { otpReferenceText: '' }
    }
    render(methodTypeRender(props))
  })
  test('should render when OTP method is defined', () => {
    const props = {
      methodType: 1,
      otpReference: '41728123',
      classes: { otpReferenceText: '' }
    }
    render(methodTypeRender(props))
  })
})

describe('Input Label renders', () => {
  test('should have no error with different type of props', () => {
    render(inputLabelRender({
      methodType: undefined,
      otpReference: undefined,
      bank: undefined
    }))
    render(inputLabelRender({
      methodType: 1,
      otpReference: '4123512',
      bank: 'VCB'
    }))
    render(inputLabelRender({
      methodType: 2,
      otpReference: '4123512',
      bank: 'VCB'
    }))
    render(inputLabelRender({
      methodType: 3,
      otpReference: '4123512',
      bank: 'VCB'
    }))
    render(inputLabelRender({
      methodType: 4,
      otpReference: '4123512',
      bank: 'VCB'
    }))
  })
})

describe('Error Message NotCardOtp renders', () => {
  test('should have no error with different type of props', () => {
    render(notCardOtpErrorMessagesRender({
      errors: { OTP: { message: 'error', type: 'minLength' } }
    }))
    render(notCardOtpErrorMessagesRender({
      errors: { OTP: { message: 'error', type: 'required' } }
    }))
    render(notCardOtpErrorMessagesRender({
      errors: { OTP: { message: 'error', type: 'maxLength' } }
    }))
    render(notCardOtpErrorMessagesRender({
      errors: { OTP: { message: 'error', type: undefined } }
    }))
  })
})

describe('Error Message isCardOtp renders', () => {
  test('should have no error with different type of props', () => {
    render(cardOtpErrorMessageRender({
      errors: undefined
    }))
    render(cardOtpErrorMessageRender({
      errors: {
        OTP1: { message: 'error', type: 'maxLength' }
      }
    }))
    render(cardOtpErrorMessageRender({
      errors: {
        OTP1: { message: 'error', type: 'required' }
      }
    }))
    render(cardOtpErrorMessageRender({
      errors: {
        OTP2: { message: 'error', type: 'maxLength' }
      }
    }))
    render(cardOtpErrorMessageRender({
      errors: {
        OTP2: { message: 'error', type: 'maxLength' }
      }
    }))
  })
})
