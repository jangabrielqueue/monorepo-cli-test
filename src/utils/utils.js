// Utility Functions

function isNullOrWhitespace (input) {
  if (typeof input === 'undefined' || input == null) return true
  return input.replace(/\s/g, '').length < 1
}

function isNullorUndefined (input) {
  if (typeof input === 'undefined' || input == null) return true
}

function isJSON (item) {
  item = typeof item !== 'string'
    ? JSON.stringify(item)
    : item
  try {
    item = JSON.parse(item)
  } catch (e) {
    return false
  }

  if (typeof item === 'object' && item !== null) {
    return true
  }

  return false
}

function getOtpMethod (otpReference) {
  return isJSON(otpReference) ? JSON.parse(otpReference)?.MethodType : undefined
}

function getOtpReference (otpReference) {
  return isJSON(otpReference) ? JSON.parse(otpReference)?.RefId : otpReference
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

export {
  isNullOrWhitespace,
  isNullorUndefined,
  isJSON,
  getOtpMethod,
  getOtpReference,
  sleep,
  calculateCurrentProgress,
  renderButtonColors,
  isTopUp,
  checkIfAppOneOtp,
  checkIfAppTwoOtp
}
