import getVietQRCode from '../../components/VietQr'

describe('Countdown unit test', () => {
  test.each([
    [{ bank: 'ACB', id: '4323421', amount: 1000, reference: 'fke32k32ero302qq' }, '00020101021238510010A00000072701210006970416010743234210208QRIBFTTA5303704540410005802VN62200816fke32k32ero302qq63044AC1'],
    [{ bank: 'ACB', id: '4323421', amount: '1000', reference: 'fke32k32ero302qq' }, '00020101021238510010A00000072701210006970416010743234210208QRIBFTTA5303704540410005802VN62200816fke32k32ero302qq63044AC1'],
    [{ bank: 'ACB', id: '4323421', amount: '1000.00', reference: 'fke32k32ero302qq' }, '00020101021238510010A00000072701210006970416010743234210208QRIBFTTA5303704540410005802VN62200816fke32k32ero302qq63044AC1'],
    [{ bank: 'ACB', id: '4323421', amount: 1000.00, reference: 'fke32k32ero302qq' }, '00020101021238510010A00000072701210006970416010743234210208QRIBFTTA5303704540410005802VN62200816fke32k32ero302qq63044AC1']
  ])('pass on any value of Amount', (x, expectedValue) => expect(getVietQRCode(x.bank, x.id, x.amount, x.reference)).toBe(expectedValue))

  test.each([
    [{ bank: 'SACOM', id: '4323421', amount: 1000, reference: 'fk-e32k32ero302qq' }, '00020101021238510010A00000072701210006970403010743234210208QRIBFTTA5303704540410005802VN62200816fke32k32ero302qq63040F2F']
  ])('pass on SACOM reference remove hyphen', (x, expectedValue) => expect(getVietQRCode(x.bank, x.id, x.amount, x.reference)).toBe(expectedValue))
})
