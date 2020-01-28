const ENV = process.env.REACT_APP_ENV;

const isUatOrDev = ENV === "UAT" || ENV === "DEVELOPMENT";

const VCB = { code: "VCB", name: "Vietcombank" };
const ACB = { code: "ACB", name: "NganHang A Chau ACB" };
const VTB = { code: "VTB", name: "VTB" };
const DAB = { code: "DAB", name: "DAB" };
const BIDV = { code: "BIDV", name: "Ngan Hang BIDV" };
const TCB = { code: "TCB", name: "TCB" };
const EXIM = { code: "EXIM", name: "EXIM" };
const SACOM = { code: "SACOM", name: "SACOM" };
const AGRI = { code: "AGRI", name: "Agribank" };
const FAKER = { code: "FAKER", name: "Faker" };

const KBANK = { code: "KBANK", name: "KBANK" };
const KTB = { code: "KTB", name: "KTB" };
const SCB = { code: "SCB", name: "SCB" };
const BBL = { code: "BBL", name: "BBL" };
const BOA = { code: "BOA", name: "BOA" };
const TMB = { code: "TMB", name: "TMB" };
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
};
