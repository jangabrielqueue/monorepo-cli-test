import React from 'react';
import { checkBankIfKnown } from "../utils/banks";

const getFilePath = (bank, currency, type) => {
  const isBankKnown = checkBankIfKnown(currency, bank);

  if (isBankKnown) {
    return require(`../assets/banks/${bank}_LOGO.png`);
  } else if (bank === 'PRECARD' && type === 'scratch-card') {
    return require(`../assets/banks/PRECARD_LOGO.png`);
  }

  return require('../assets/banks/GW_LOGO.png');
};

const Logo = ({ bank, currency, type }) => {
  return (
    <section className='logo'>
      <img alt={bank} src={getFilePath(bank, currency, type)} />
    </section>
  );
};

export default Logo;
