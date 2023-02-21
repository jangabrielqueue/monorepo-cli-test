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
const MSB = { code: 'MSB', name: 'Maritime Commercial Joint Stock Bank' }
const VIB = { code: 'VIB', name: 'Vietnam International Commercial Joint Stock Bank' }

const KBANK = { code: 'KBANK', name: 'Kasikorn Bank' }
const KTB = { code: 'KTB', name: 'Krung Thai Bank' }
const SCB = { code: 'SCB', name: 'Siam Commercial Bank' }
const BBL = { code: 'BBL', name: 'Bangkok Bank' }
const BOA = { code: 'BOA', name: 'Ayudhya Bank / Krungsri' }
const TMB = { code: 'TMB', name: 'TMB Bank' }
const FAKERTHB = { code: 'FAKERTHB', name: 'Faker THB' }
const TRUEWALLET = { code: 'TRUEWALLET', name: 'True Money Wallet' }

const PERMATA = { code: 'PERMATA', name: 'Permata Bank' }
const CIMB = { code: 'CIMB', name: 'CIMB Niaga' }
const MANDIRI = { code: 'MANDIRI', name: 'MANDIRI Bank' }
const BRI = { code: 'BRI', name: 'Bank BRI' }
const BCA = { code: 'BCA', name: 'Bank Central Asia' }
const BNI = { code: 'BNI', name: 'Bank Negara Indonesia' }
const MOMO = { code: 'MOMO', name: 'MomoPay' }
const ZALOPAY = { code: 'ZALOPAY', name: 'ZaloPay' }

const VND_ALL_BANKS = [VCB, ACB, VTB, DAB, BIDV, TCB, EXIM, SACOM, AGRI, MSB, VIB, MOMO, ZALOPAY]
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
  FAKER,
  MSB,
  VIB,
  MOMO,
  ZALOPAY
]

const THB_ALL_BANKS = [KBANK, KTB, SCB, BBL, BOA, TMB, TRUEWALLET]
const THB_ALL_BANKS_DEV = [KBANK, KTB, SCB, BBL, BOA, TMB, FAKERTHB, TRUEWALLET]

const VND_TOPUP_BANKS = [VCB, ACB, TCB, BIDV, SACOM]
const VND_TOPUP_BANKS_DEV = [VCB, ACB, TCB, BIDV, SACOM, FAKER]

const THB_TOPUP_BANKS = [KBANK, KTB, SCB, BBL, BOA, TMB, TRUEWALLET]
const THB_TOPUP_BANKS_DEV = [KBANK, KTB, SCB, BBL, BOA, TMB, FAKERTHB, TRUEWALLET]

const IDR_ALL_BANKS = [PERMATA, CIMB, MANDIRI, BRI, BCA, BNI]
const IDR_ALL_BANKS_DEV = [PERMATA, CIMB, MANDIRI, BRI, BCA, BNI]

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
  if (currency?.toUpperCase() === 'VND') {
    return getVndBanksByEnvForDeposit()
  } else if (currency?.toUpperCase() === 'THB') {
    return getThbBanksByEnvForDeposit()
  } else if (currency?.toUpperCase() === 'IDR') {
    return getIdrBanksByEnvForDeposit()
  }
  return []
}

function checkBankIfKnown (currency, bank) {
  if (currency?.toUpperCase() === 'VND' && bank) {
    return getVndBanksByEnvForDeposit().map(c => c.code).includes(bank.toUpperCase())
  } else if (currency?.toUpperCase() === 'THB' && bank) {
    return getThbBanksByEnvForDeposit().map(c => c.code).includes(bank.toUpperCase())
  } else if (currency?.toUpperCase() === 'IDR' && bank) {
    return getIdrBanksByEnvForDeposit().map(c => c.code).includes(bank.toUpperCase())
  } else {
    return false
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
  if (currency?.toUpperCase() === 'VND') {
    return getVndBanksByEnvForTopUp()
  } else if (currency?.toUpperCase() === 'THB') {
    return getThbBanksByEnvForTopUp()
  }
  return []
}

function checkIfVndCurrency (currency) {
  return currency?.toUpperCase() === 'VND'
}

function checkIfDABBank (bank) {
  return bank?.toUpperCase() === 'DAB'
}

function checkIfMandiriBank (bank) {
  return bank?.toUpperCase() === 'MANDIRI'
}

function checkIfGWCBank (bank) {
  return bank?.toUpperCase() === 'GWC'
}

function checkIfBcaBank (bank) {
  return bank?.toUpperCase() === 'BCA'
}

function checkIfBniBank (bank) {
  return bank?.toUpperCase() === 'BNI'
}

function checkIfBidvBank (bank) {
  return bank?.toUpperCase() === 'BIDV'
}

function checkIfAcbBank (bank) {
  return bank?.toUpperCase() === 'ACB'
}

function checkIfFakerBank (bank) {
  return bank?.toUpperCase() === 'FAKER'
}

function checkIfFakerThbBank (bank) {
  return bank?.toUpperCase() === 'FAKERTHB'
}

function checkIfNullBank (bank) {
  return bank?.toUpperCase() === 'NULL'
}

function checkIfAutoBank (bank) {
  return bank?.toUpperCase() === 'AUTO'
}

function checkIfMsbBank (bank) {
  return bank?.toUpperCase() === 'MSB'
}

function checkifAgriBank (bank) {
  return bank?.toUpperCase() === 'AGRI'
}

function checkIfTcbBank (bank) {
  return bank?.toUpperCase() === 'TCB'
}

function checkIfSacomBank (bank) {
  return bank?.toUpperCase() === 'SACOM'
}

function checkIfTrueWalletBank (bank) {
  return bank?.toUpperCase() === 'TRUEWALLET'
}

function checkIfMomoBank (bank) {
  return bank?.toUpperCase() === 'MOMO'
}

function checkIfZaloBank (bank) {
  return bank?.toUpperCase() === 'ZALOPAY'
}

function checkIfTHBCurrency (currency) {
  return currency?.toUpperCase() === 'THB'
}

module.exports = {
  getBanksByCurrency,
  getBanksByCurrencyForTopUp,
  checkBankIfKnown,
  checkIfDABBank,
  checkIfMandiriBank,
  checkIfGWCBank,
  checkIfBcaBank,
  checkIfBniBank,
  checkIfBidvBank,
  checkIfAcbBank,
  checkIfVndCurrency,
  checkIfFakerBank,
  checkIfFakerThbBank,
  checkIfNullBank,
  checkIfAutoBank,
  checkIfMsbBank,
  checkifAgriBank,
  checkIfTcbBank,
  checkIfSacomBank,
  checkIfTHBCurrency,
  checkIfTrueWalletBank,
  checkIfMomoBank,
  checkIfZaloBank
}
