const ENV = process.env.REACT_APP_ENV;

const isUatOrDev = ENV === "UAT" || ENV === "DEVELOPMENT";

const VND_ALL_BANKS = [
  "VCB",
  "ACB",
  "VTB",
  "DAB",
  "BIDV",
  "TCB",
  "EXIM",
  "SACOM",
  "AGRI",
];

const VND_TOPUP_BANKS = ["VCB", "ACB", "TCB", "BIDV", "SACOM"];
const VND_TOPUP_BANKS_DEV = ["VCB", "ACB", "TCB", "BIDV", "SACOM", "FAKER"];

const THB_TOPUP_BANKS = ["KBANK", "KTB", "SCB", "BBL", "BOA", "TMB"];
const THB_TOPUP_BANKS_DEV = [
  "KBANK",
  "KTB",
  "SCB",
  "BBL",
  "BOA",
  "TMB",
  "FAKERTHB",
];

function getVndBanksByEnv() {
  if (isUatOrDev) {
    return VND_TOPUP_BANKS_DEV;
  }
  return VND_TOPUP_BANKS;
}

function getThbBanksByEnv() {
  if (isUatOrDev) {
    return THB_TOPUP_BANKS_DEV;
  }
  return THB_TOPUP_BANKS;
}

export function getBanksByCurrency(currency) {
  if (currency === "VND") {
    return getVndBanksByEnv();
  } else if (currency === "THB") {
    return getThbBanksByEnv();
  }
  return [];
}
