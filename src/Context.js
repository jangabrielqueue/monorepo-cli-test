import React from "react";

export const RequestContext = React.createContext({
    merchant: "",
    customer: "",
    currency: "",
    bank: "",
    amount: 0,
    referenceId: "",
});
