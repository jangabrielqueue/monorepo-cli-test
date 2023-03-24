// Utility Functions

function isNullOrWhitespace (input) {
  if (typeof input === 'undefined' || input == null) return true
  return input.replace(/\s/g, '').length < 1
}

function isNullorUndefined (input) {
  if (typeof input === 'undefined' || input == null) return true
}

function getOtpMethod (otpReference) {
  if (typeof otpReference === 'object') {
    return otpReference?.MethodType
  }
  return undefined
}

function getOtpReference (otpReference) {
  if (typeof otpReference === 'object') {
    return otpReference?.RefId
  }
  return otpReference
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function calculateCurrentProgress (e) {
  // Math.max returns whichever is the largest number to move forward
  // 13 totalSteps = 10 dynamic steps (steps from update) + 3 fake steps
  // (update step/update totalstep) and then multiple by (dynamic steps + fake steps)
  const fakeSteps = 3
  const dynamicSteps = 10

  return Math.max(e.currentStep, (e.currentStep / e.totalSteps) * dynamicSteps + fakeSteps)
}

function renderButtonColors (bank, color) {
  switch (bank) {
    case 'PERMATA':
      return 'buttonPermata'
    case 'MANDIRI':
      return 'buttonMandiri'
    case 'BCA':
      return 'buttonBca'
    case 'BRI':
      return 'buttonBri'
    case 'BNI':
      return 'buttonBni'
    default:
      return color?.toLowerCase()
  }
}

function isTopUp (props) {
  return props.topup === 'true'
}

function checkIfAppOneOtp (otpReference) {
  return otpReference.includes('APP1')
}

function checkIfAppTwoOtp (otpReference) {
  return otpReference.includes('APP2')
}

function checkIfQrOtp (otpReference) {
  if (typeof otpReference === 'object') {
    return false
  }
  return otpReference?.includes('QRCODE_')
}

function convertToMiliseconds (time) {
  return time.minutes * 60000 + time.seconds * 1000
}

const currencyValue = {
  VND: [1, 'Vn Dong'],
  THB: [2, 'Thai Baht'],
  RMB: [3, 'Renminbi'],
  IDR: [4, 'Rupiah'],
  MYR: [5, 'Ringgit'],
  KRW: [6, 'Korean Won']
}
function getCurrencyValue (currency) {
  return currencyValue[currency][0]
}

function getCurrencyText (currency) {
  return currencyValue[currency][1]
}

const cryptoHelperTexts = {
  USDT: 'TRC-20 Tether'
}

export {
  checkIfQrOtp,
  isNullOrWhitespace,
  isNullorUndefined,
  getOtpMethod,
  getOtpReference,
  sleep,
  calculateCurrentProgress,
  renderButtonColors,
  isTopUp,
  checkIfAppOneOtp,
  checkIfAppTwoOtp,
  convertToMiliseconds,
  getCurrencyValue,
  getCurrencyText,
  cryptoHelperTexts
}
