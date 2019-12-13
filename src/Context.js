import React from "react";

export const RequestContext = React.createContext({
  merchant: "",
  requester: "",
  currency: "",
  bank: "",
  amount: 0,
  referenceId: "",
  signature: "",
});
