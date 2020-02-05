import React from "react";

const FILES = {
  DEFAULT: "/banks/GW_LOGO.png",
  FAKER: "/banks/GW_LOGO.png",
  FAKERTHB: "/banks/GW_LOGO.png",
  BIDV: "/banks/BIDV_LOGO.svg",
  SCB: "/banks/SCB_LOGO.svg",
  BBL: "/banks/BBL_LOGO.svg",
  C3TEK: "/banks/GW_LOGO.png"
};

const getFilePath = bank => {
  const file = FILES[bank || "DEFAULT"];
  if (file) {
    return file;
  } else {
    return `/banks/${bank}_LOGO.png`;
  }
};

const ACB = (
  <>
    <img alt="poweredBy" className="poweredby" src="/banks/PoweredBy.svg" />
    <img alt="ACB" style={{ width: 100 }} src={getFilePath("ACB")} />
  </>
);

const VCB = (
  <>
    <div
      style={{
        margin: "auto",
        width: "130px",
        textAlign: "right",
      }}
    >
      <img alt="poweredBy" className="poweredby" src="/banks/PoweredBy.svg" />
    </div>
    <img alt="VCB" style={{ width: "160px" }} src={getFilePath("VCB")} />
  </>
);

const TCB = (
  <>
    <div
      style={{
        margin: "auto",
        width: "140px",
        textAlign: "right",
      }}
    >
      <img alt="poweredBy" className="poweredby" src="/banks/PoweredBy.svg" />
    </div>
    <div style={{ margin: "auto", width: "140px" }}>
      <img alt="TCB" src={getFilePath("TCB")} />
    </div>
  </>
);

// const DAB = (
//   <>
//     <div
//       style={{
//         margin: "auto",
//         width: "180px",
//         textAlign: "right",
//       }}
//     >
//       <img className="poweredby" src="/banks/PoweredBy.svg" />
//     </div>
//     <img src={getFilePath("DAB")} />
//   </>
// );

const EXIM = (
  <>
    <div
      style={{
        margin: "auto",
        width: "150px",
        textAlign: "right",
      }}
    >
      <img alt="poweredBy" className="poweredby" src="/banks/PoweredBy.svg" />
    </div>
    <img alt="EXIM" style={{ width: "160px" }} src={getFilePath("EXIM")} />
  </>
);

const SCB = (
  <>
    <div
      style={{
        margin: "auto",
        marginBottom: "5px",
        width: "160px",
        textAlign: "right",
      }}
    >
      <img alt="poweredBy" className="poweredby" src="/banks/PoweredBy.svg" />
    </div>
    <img src={getFilePath("SCB")} />
  </>
);

const TMB = (
  <>
    {/* <img className="poweredby" src="/banks/PoweredBy.svg" /> */}
    <img alt="TMB" style={{ width: 120 }} src={getFilePath("TMB")} />
  </>
);

const VIB = (
  <>
    {/* <img className="poweredby" src="/banks/PoweredBy.svg" /> */}
    <img alt="VIB" src={getFilePath("VIB")} />
  </>
);

const BANK_LOGOS = {
  ACB: ACB,
  VCB: VCB,
  TCB: TCB,
  // DAB: DAB,
  EXIM: EXIM,
  SCB: SCB,
  TMB: TMB,
  VIB: VIB,
};

const Logo = ({ bank }) => {
  if (BANK_LOGOS[bank]) {
    return BANK_LOGOS[bank];
  }
  return (
    <>
      <div
        style={{
          margin: "auto",
          width: "140px",
          textAlign: "right",
        }}
      >
        <img alt="poweredBy" className="poweredby" src="/banks/PoweredBy.svg" />
      </div>
      <img alt={bank} src={getFilePath(bank)} />
    </>
  );
};

export default Logo;
