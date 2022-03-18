var crc = require('crc')

const bankList = [
  {
    name: 'VCB',
    id: '970436'
  },
  {
    name: 'ACB',
    id: '970416'
  },
  {
    name: 'VTB',
    id: '970415'
  },
  {
    name: 'DAB',
    id: '970406'
  },
  {
    name: 'BIDV',
    id: '970418'
  },
  {
    name: 'TCB',
    id: '970407'
  },
  {
    name: 'EXIM',
    id: '970431'
  },
  {
    name: 'SACOM',
    id: '970403'
  },
  {
    name: 'AGRI',
    id: '970405'
  },
  {
    name: 'FAKER',
    id: '123456'
  },
  {
    name: 'MSB',
    id: '970426'
  },
  {
    name: 'VIB',
    id: '970441'
  }
] // Reference [2]

const FI = '000201' // Payload Format Indicator
const IM = '010212' // Point of Initiation Method
const CU = '5303704' // Currency (VND)
const CO = '5802VN' // Country Code (Vietnam)
const GU = '0010A000000727' // GUI Code
const SC = '0208QRIBFTTA' // Service Code for Merchant Account Information

const getVietQRCode = (bank, id, amount, reference) => {
  const bankID = bankList.filter((data) => {
    return data.name === bank
  })[0]?.id

  let message = ''
  let AI = '' // Addtional Information
  let AM = '' // Amount modified

  if (['SACOM'].includes(bank)) {
    message = reference?.replace(/[-\s]/g, '')
  } else {
    message = reference
  }

  const BC = `0006${bankID}` // Bank BIN ID
  const MI = `01${handleLength(id?.length)}${id}` // Merchant/customer ID
  const BO = `01${handleLength(BC.length + MI.length)}${BC}${MI}` // Beneficiary organization
  const MAI = `38${handleLength(BO.length + GU.length + SC.length)}${GU}${BO}${SC}` // Merchant Account Information

  if (amount) {
    AM = `54${handleLength(amount?.length)}${amount}` // Amount modified
  }

  if (reference) {
    const PT = `08${handleLength(message?.length)}${message}` // Purpose of Transaction
    AI = `62${handleLength(PT.length)}${PT}`
  }

  const cRCPayload = `${FI}${IM}${MAI}${CU}${AM}${CO}${AI}6304`
  const cRCResponse = crc.crc16ccitt(cRCPayload).toString(16).padStart(4, '0').toUpperCase()

  const qRCode = `${cRCPayload}${cRCResponse}`
  return qRCode
}

const handleLength = (length) => {
  const string = length?.toString().padStart(2, '0')
  return string
}

module.exports = getVietQRCode

// References:
// [1] https://vietqr.net/
// [2] https://www.sbv.gov.vn/webcenter/portal/vi/menu/trangchu/ttvnq/htmtcqht?centerWidth=80%25&leftWidth=20%25&rightWidth=0%25&showFooter=false&showHeader=false&_adf.ctrl-state=19bth7bxgk_4&_afrLoop=48033115100114224#%40%3F_afrLoop%3D48033115100114224%26centerWidth%3D80%2525%26leftWidth%3D20%2525%26rightWidth%3D0%2525%26showFooter%3Dfalse%26showHeader%3Dfalse%26_adf.ctrl-state%3Dirvwddrok_4
