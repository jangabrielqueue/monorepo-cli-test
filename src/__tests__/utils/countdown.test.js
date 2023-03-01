import { initialTime } from '../../components/Countdown'

describe('Countdown unit test', () => {
  test.each([
    [{ min: null, sec: null }, '00:00'],
    [{ min: undefined, sec: undefined }, '00:00'],
    [{ min: 10, sec: null }, '10:00'],
    [{ min: 10, sec: undefined }, '10:00'],
    [{ min: undefined, sec: 10 }, '00:10'],
    [{ min: null, sec: 10 }, '00:10'],
    [{ min: 20, sec: 0 }, '20:00'],
    [{ min: 0, sec: 100 }, '01:40'],
    [{ min: 10, sec: 200 }, '13:20']
  ])('pass on any value of min, sec', (x, expectedValue) => expect(initialTime(x)).toBe(expectedValue))
})
