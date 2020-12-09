const ENV = process.env.REACT_APP_ENV

const isUatOrDev = ENV === 'UAT' || ENV === 'DEVELOPMENT'

const VCB = { code: 'VCB', name: 'VietcomBank' }
const ACB = { code: 'ACB', name: 'NganHang A Chau ACB' }
const VTB = { code: 'VTB', name: 'VietinBank' }
const DAB = { code: 'DAB', name: 'ĐôngÁ Bank' }
const BIDV = { code: 'BIDV', name: 'Ngan Hang BIDV' }
const TCB = { code: 'TCB', name: 'TechcomBank' }
const EXIM = { code: 'EXIM', name: 'EximBank' }
const SACOM = { code: 'SACOM', name: 'SacomBank' }
const AGRI = { code: 'AGRI', name: 'AgriBank' }
const FAKER = { code: 'FAKER', name: 'Faker VND' }

const KBANK = { code: 'KBANK', name: 'Kasikorn Bank' }
const KTB = { code: 'KTB', name: 'Krung Thai Bank' }
const SCB = { code: 'SCB', name: 'Siam Commercial Bank' }
const BBL = { code: 'BBL', name: 'Bangkok Bank' }
const BOA = { code: 'BOA', name: 'Ayudhya Bank / Krungsri' }
const TMB = { code: 'TMB', name: 'TMB Bank' }
const FAKERTHB = { code: 'FAKERTHB', name: 'Faker THB' }

const PERMATA = { code: 'PERMATA', name: 'Permata Bank' }
const CIMB = { code: 'CIMB', name: 'CIMB Niaga' }
const MANDIRI = { code: 'MANDIRI', name: 'MANDIRI Bank' }
const BCA = { code: 'BCA', name: 'Bank Central Asia' }
const BRI = { code: 'BRI', name: 'Bank BRI' }

const VND_ALL_BANKS = [VCB, ACB, VTB, DAB, BIDV, TCB, EXIM, SACOM, AGRI]
const VND_ALL_BANKS_DEV = [
  VCB,
  ACB,
  VTB,
  DAB,
  BIDV,
  TCB,
  EXIM,
  SACOM,
  AGRI,
  FAKER
]

const THB_ALL_BANKS = [KBANK, KTB, SCB, BBL, BOA, TMB]
const THB_ALL_BANKS_DEV = [KBANK, KTB, SCB, BBL, BOA, TMB, FAKERTHB]

const VND_TOPUP_BANKS = [VCB, ACB, TCB, BIDV, SACOM]
const VND_TOPUP_BANKS_DEV = [VCB, ACB, TCB, BIDV, SACOM, FAKER]

const THB_TOPUP_BANKS = [KBANK, KTB, SCB, BBL, BOA, TMB]
const THB_TOPUP_BANKS_DEV = [KBANK, KTB, SCB, BBL, BOA, TMB, FAKERTHB]

const IDR_ALL_BANKS = [PERMATA, CIMB, MANDIRI, BCA, BRI]
const IDR_ALL_BANKS_DEV = [PERMATA, CIMB, MANDIRI, BCA, BRI]

function getVndBanksByEnvForDeposit () {
  if (isUatOrDev) {
    return VND_ALL_BANKS_DEV
  }
  return VND_ALL_BANKS
}

function getThbBanksByEnvForDeposit () {
  if (isUatOrDev) {
    return THB_ALL_BANKS_DEV
  }
  return THB_ALL_BANKS
}

function getIdrBanksByEnvForDeposit () {
  if (isUatOrDev) {
    return IDR_ALL_BANKS_DEV
  }
  return IDR_ALL_BANKS
}

function getBanksByCurrency (currency) {
  if (currency && currency.toUpperCase() === 'VND') {
    return getVndBanksByEnvForDeposit()
  } else if (currency && currency.toUpperCase() === 'THB') {
    return getThbBanksByEnvForDeposit()
  } else if (currency && currency.toUpperCase() === 'IDR') {
    return getIdrBanksByEnvForDeposit()
  }
  return []
}

function checkBankIfKnown (currency, bank) {
  if (currency && currency.toUpperCase() === 'VND' && bank) {
    return getVndBanksByEnvForDeposit().map(c => c.code).includes(bank.toUpperCase())
  } else if (currency && currency.toUpperCase() === 'THB' && bank) {
    return getThbBanksByEnvForDeposit().map(c => c.code).includes(bank.toUpperCase())
  } else if (currency && currency.toUpperCase() === 'IDR' && bank) {
    return getIdrBanksByEnvForDeposit().map(c => c.code).includes(bank.toUpperCase())
  }
}

function getVndBanksByEnvForTopUp () {
  if (isUatOrDev) {
    return VND_TOPUP_BANKS_DEV
  }
  return VND_TOPUP_BANKS
}

function getThbBanksByEnvForTopUp () {
  if (isUatOrDev) {
    return THB_TOPUP_BANKS_DEV
  }
  return THB_TOPUP_BANKS
}

function getBanksByCurrencyForTopUp (currency) {
  if (currency && currency.toUpperCase() === 'VND') {
    return getVndBanksByEnvForTopUp()
  } else if (currency && currency.toUpperCase() === 'THB') {
    return getThbBanksByEnvForTopUp()
  }
  return []
}

function checkIfDABBank (bank) {
  return bank && bank.toUpperCase() === 'DAB'
}

function checkIfMandiriBank (bank) {
  return bank && bank.toUpperCase() === 'MANDIRI'
}

module.exports = {
  getBanksByCurrency,
  getBanksByCurrencyForTopUp,
  checkBankIfKnown,
  checkIfDABBank,
  checkIfMandiriBank
}
