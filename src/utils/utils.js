// Utility Functions

function isNullOrWhitespace (input) {
  if (typeof input === 'undefined' || input == null) return true
  return input.replace(/\s/g, '').length < 1
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
    default:
      return color?.toLowerCase()
  }
}

function isTopUp (props) {
  return props.topup === 'true'
}

function isBidvBank (props) {
  return props.bank?.toUpperCase() === 'BIDV'
}

function checkIfAppOneOtp (otpReference) {
  return otpReference.includes('APP1')
}

function checkIfAppTwoOtp (otpReference) {
  return otpReference.includes('APP2')
}

export {
  isNullOrWhitespace,
  sleep,
  calculateCurrentProgress,
  renderButtonColors,
  isTopUp,
  isBidvBank,
  checkIfAppOneOtp,
  checkIfAppTwoOtp
}
