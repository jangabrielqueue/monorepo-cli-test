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

const thbBanks = ["KBANK", "KTB", "SCB", "BBL", "BOA", "TMB"];

export function getBanksByCurrency(currency) {
  if (currency === "VND") {
    return vndBanks;
  } else if (currency === "THB") {
    return thbBanks;
  }
  return [];
}
