const vndBanks = [
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

const VND_TOPUP_BANKS = [
  "VCB",
  "ACB",
  "TCB",
  "BIDV",
  "SACOM",
];

const thbBanks = ["KBANK", "KTB", "SCB", "BBL", "BOA", "TMB"];

export function getBanksByCurrency(currency) {
  if (currency === "VND") {
    return VND_TOPUP_BANKS;
  } else if (currency === "THB") {
    return thbBanks;
  }
  return [];
}
