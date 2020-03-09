import React from 'react';
import { checkBankIfKnown } from "../utils/banks";

const getFilePath = (bank, currency) => {
  const isBankKnown = checkBankIfKnown(currency, bank);

  if (isBankKnown) {
    return require(`../assets/banks/${bank}_LOGO.svg`);
  }

  return require('../assets/banks/GW_LOGO.svg');
};

const Logo = ({ bank, currency }) => {
  return (
    <section className='logo'>
      <img alt={bank} src={getFilePath(bank, currency)} />
    </section>
  );
};

export default Logo;
