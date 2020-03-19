
import React from 'react';
import { ReactComponent as SMSUnknown } from '../../assets/icons/unknown/sms-unknown.svg';
import { ReactComponent as SMARTUnknown } from '../../assets/icons/unknown/smart-unknown.svg';
import { ReactComponent as SMSFaker } from '../../assets/icons/faker/sms-faker.svg';
import { ReactComponent as SMARTfaker } from '../../assets/icons/faker/smart-faker.svg';
import { ReactComponent as SMSFakerThb } from '../../assets/icons/faker/sms-fakerthb.svg';
import { ReactComponent as SMARTfakerThb } from '../../assets/icons/faker/smart-fakerthb.svg';
import { ReactComponent as SMSTCB } from '../../assets/icons/tcb/sms-tcb.svg';
import { ReactComponent as SMARTTCB } from '../../assets/icons/tcb/smart-tcb.svg';
import { ReactComponent as SMSTMB } from '../../assets/icons/tmb/sms-tmb.svg';
import { ReactComponent as SMARTTMB } from '../../assets/icons/tmb/smart-tmb.svg';
import { ReactComponent as SMSBOA } from '../../assets/icons/boa/sms-boa.svg';
import { ReactComponent as SMARTBOA } from '../../assets/icons/boa/smart-boa.svg';
import { ReactComponent as SMSKTB } from '../../assets/icons/ktb/sms-ktb.svg';
import { ReactComponent as SMARTKTB } from '../../assets/icons/ktb/smart-ktb.svg';
import { ReactComponent as SMSBBL } from '../../assets/icons/bbl/sms-bbl.svg';
import { ReactComponent as SMARTBBL } from '../../assets/icons/bbl/smart-bbl.svg';
import { ReactComponent as SMSKBANK } from '../../assets/icons/kbank/sms-kbank.svg';
import { ReactComponent as SMARTKBANK } from '../../assets/icons/kbank/smart-kbank.svg';
import { ReactComponent as SMSSCB } from '../../assets/icons/scb/sms-scb.svg';
import { ReactComponent as SMARTSCB } from '../../assets/icons/scb/smart-scb.svg';
import { ReactComponent as SMSVIB } from '../../assets/icons/vib/sms-vib.svg';
import { ReactComponent as SMARTVIB } from '../../assets/icons/vib/smart-vib.svg';
import { ReactComponent as SMSAgri } from '../../assets/icons/agri/sms-agri.svg';
import { ReactComponent as SMARTAgri } from '../../assets/icons/agri/smart-agri.svg';
import { ReactComponent as SMSExim } from '../../assets/icons/exim/sms-exim.svg';
import { ReactComponent as SMARTExim } from '../../assets/icons/exim/smart-exim.svg';
import { ReactComponent as SMSDAB } from '../../assets/icons/dab/sms-dab.svg';
import { ReactComponent as SMARTDAB } from '../../assets/icons/dab/smart-dab.svg';
import { ReactComponent as SMSBIDV } from '../../assets/icons/bidv/sms-bidv.svg';
import { ReactComponent as SMARTBIDV } from '../../assets/icons/bidv/smart-bidv.svg';
import { ReactComponent as SMSVCB } from '../../assets/icons/vcb/sms-vcb.svg';
import { ReactComponent as SMARTVCB } from '../../assets/icons/vcb/smart-vcb.svg';
import { ReactComponent as SMSACB } from '../../assets/icons/acb/sms-acb.svg';
import { ReactComponent as SMARTACB } from '../../assets/icons/acb/smart-acb.svg';
import { ReactComponent as SMSSacom } from '../../assets/icons/sacom/sms-sacom.svg';
import { ReactComponent as SMARTSacom } from '../../assets/icons/sacom/smart-sacom.svg';
import { ReactComponent as SMSVTB } from '../../assets/icons/vtb/sms-vtb.svg';
import { ReactComponent as SMARTVTB } from '../../assets/icons/vtb/smart-vtb.svg';

const Icons = ({ name }) => {
    switch (name) {
        case 'sms-unknown':
            return <SMSUnknown />;
        case 'smart-unknown':
            return <SMARTUnknown />;
        case 'sms-faker':
            return <SMSFaker />;
        case 'smart-faker':
            return <SMARTfaker />;
        case 'sms-fakerthb':
            return <SMSFakerThb />;
        case 'smart-fakerthb':
            return <SMARTfakerThb />;
        case 'sms-tcb':
            return <SMSTCB />;
        case 'smart-tcb':
            return <SMARTTCB />;
        case 'sms-tmb':
            return <SMSTMB />;
        case 'smart-tmb':
            return <SMARTTMB />;
        case 'sms-boa':
            return <SMSBOA />;
        case 'smart-boa':
            return <SMARTBOA />;
        case 'sms-ktb':
            return <SMSKTB />;
        case 'smart-ktb':
            return <SMARTKTB />;
        case 'sms-bbl':
            return <SMSBBL />;
        case 'smart-bbl':
            return <SMARTBBL />;
        case 'sms-kbank':
            return <SMSKBANK />;
        case 'smart-kbank':
            return <SMARTKBANK />;
        case 'sms-scb':
            return <SMSSCB />;
        case 'smart-scb':
            return <SMARTSCB />;
        case 'sms-vib':
            return <SMSVIB />;
        case 'smart-vib':
            return <SMARTVIB />;
        case 'sms-agri':
            return <SMSAgri />;
        case 'smart-agri':
            return <SMARTAgri />;
        case 'sms-exim':
            return <SMSExim />;
        case 'smart-exim':
            return <SMARTExim />;
        case 'sms-dab':
            return <SMSDAB />;
        case 'smart-dab':
            return <SMARTDAB />;
        case 'sms-bidv':
            return <SMSBIDV />;
        case 'smart-bidv':
            return <SMARTBIDV />;
        case 'sms-vcb':
            return <SMSVCB />;
        case 'smart-vcb':
            return <SMARTVCB />;
        case 'sms-acb':
            return <SMSACB />;
        case 'smart-acb':
            return <SMARTACB />;
        case 'sms-sacom':
            return <SMSSacom />;
        case 'smart-sacom':
            return <SMARTSacom />;
        case 'sms-vtb':
            return <SMSVTB />;
        case 'smart-vtb':
            return <SMARTVTB />;
        default:
            return;
      }
}

export default Icons;
