import * as Validation from '../../utils/validation'

describe('Validate URL should works', () => {
  test.each([
    ['http://www.google.com', true],
    ['https://www.google.com', true],
    ['www.google.com', false],
    ['ftp://www.google.com', false],
    ['javascript:void(0)', false],
    ['', false],
    [null, false],
    [undefined, false]
  ])('only http and https is valid', (x, isValid) => expect(Validation.isValidUrl(x)).toBe(isValid))
})
