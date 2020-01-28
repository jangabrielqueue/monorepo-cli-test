import React from "react";

const FILES = {
  DEFAULT: "/banks/GW_LOGO.png",
  FAKER: "/banks/GW_LOGO.png",
  FAKERTHB: "/banks/GW_LOGO.png",
  BIDV: "/banks/BIDV_LOGO.svg",
  SCB: "/banks/SCB_LOGO.svg",
};

function getFilePath(bank) {
  const file = FILES[bank || "DEFAULT"];
  if (file) {
    return file;
  } else {
    return `/banks/${bank}_LOGO.png`;
  }
}

const Logo = props => {
  const { bank } = props;
  return <img src={getFilePath(bank)} />;
};

export default Logo;
