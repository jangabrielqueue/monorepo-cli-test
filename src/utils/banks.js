const ENV = process.env.REACT_APP_ENV;

const isUatOrDev = ENV === "UAT" || ENV === "DEVELOPMENT";

const VCB = { code: "VCB", name: "VietcomBank" };
const ACB = { code: "ACB", name: "NganHang A Chau ACB" };
const VTB = { code: "VTB", name: "VietinBank" };
const DAB = { code: "DAB", name: "ĐôngÁ Bank" };
const BIDV = { code: "BIDV", name: "Ngan Hang BIDV" };
const TCB = { code: "TCB", name: "TechcomBank" };
const EXIM = { code: "EXIM", name: "EximBank" };
const SACOM = { code: "SACOM", name: "SacomBank" };
const AGRI = { code: "AGRI", name: "AgriBank" };
const FAKER = { code: "FAKER", name: "Faker VND" };

const KBANK = { code: "KBANK", name: "Kasikorn Bank" };
const KTB = { code: "KTB", name: "Krung Thai Bank" };
const SCB = { code: "SCB", name: "Siam Commercial Bank" };
const BBL = { code: "BBL", name: "Bangkok Bank" };
const BOA = { code: "BOA", name: "Ayudhya Bank / Krungsri" };
const TMB = { code: "TMB", name: "TMB Bank" };
const FAKERTHB = { code: "FAKERTHB", name: "Faker THB" };

const VND_ALL_BANKS = [VCB, ACB, VTB, DAB, BIDV, TCB, EXIM, SACOM, AGRI];
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
];

const THB_ALL_BANKS = [KBANK, KTB, SCB, BBL, BOA, TMB];
const THB_ALL_BANKS_DEV = [KBANK, KTB, SCB, BBL, BOA, TMB, FAKERTHB];

const VND_TOPUP_BANKS = [VCB, ACB, TCB, BIDV, SACOM];
const VND_TOPUP_BANKS_DEV = [VCB, ACB, TCB, BIDV, SACOM, FAKER];

const THB_TOPUP_BANKS = [KBANK, KTB, SCB, BBL, BOA, TMB];
const THB_TOPUP_BANKS_DEV = [KBANK, KTB, SCB, BBL, BOA, TMB, FAKERTHB];

function getVndBanksByEnvForDeposit() {
  if (isUatOrDev) {
    return VND_ALL_BANKS_DEV;
  }
  return VND_ALL_BANKS;
}

function getThbBanksByEnvForDeposit() {
  if (isUatOrDev) {
    return THB_ALL_BANKS_DEV;
  }
  return THB_ALL_BANKS;
}

function getBanksByCurrency(currency) {
  if (currency === "VND") {
    return getVndBanksByEnvForDeposit();
  } else if (currency === "THB") {
    return getThbBanksByEnvForDeposit();
  }
  return [];
}

function checkBankIfKnown (currency, bank) {
    if (currency === 'VND') {
      return getVndBanksByEnvForDeposit().map(c => c.code).includes(bank)
    } else if (currency === 'THB') {
      return getThbBanksByEnvForDeposit().map(c => c.code).includes(bank)
    }
}

function getVndBanksByEnvForTopUp() {
  if (isUatOrDev) {
    return VND_TOPUP_BANKS_DEV;
  }
  return VND_TOPUP_BANKS;
}

function getThbBanksByEnvForTopUp() {
  if (isUatOrDev) {
    return THB_TOPUP_BANKS_DEV;
  }
  return THB_TOPUP_BANKS;
}

function getBanksByCurrencyForTopUp(currency) {
  if (currency === "VND") {
    return getVndBanksByEnvForTopUp();
  } else if (currency === "THB") {
    return getThbBanksByEnvForTopUp();
  }
  return [];
}

module.exports = {
  getBanksByCurrency,
  getBanksByCurrencyForTopUp,
  checkBankIfKnown
};
