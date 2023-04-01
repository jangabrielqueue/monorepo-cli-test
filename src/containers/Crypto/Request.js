import axios from 'axios'
const API_GET_BANK = 'api/deposit/banks?api-version=2.0&'
const API_GET_EXCHANGE_RATE = 'api/deposit/ExchangeRates?api-version=2.0'
export async function getBankRequest({ paymentChannel, currency }) {
  try {
    const rsp = await axios.get(`${API_GET_BANK}&method=7&currency=${currency}&channel=${paymentChannel}`)
    return rsp.data
  } catch (ex) {
    if (ex.isAxiosError) {
      return ex.response.data
    } else {
      return { error: { code: 'UnknownException', message: ex.message } }
    }
  }
}

export async function getExchangeRateRequest(payload) {
  try {
    const rsp = await axios.post(API_GET_EXCHANGE_RATE, payload)
    return rsp.data
  } catch (ex) {
    if (ex.isAxiosError) {
      return ex.response.data
    } else {
      return { error: { code: 'UnknownException', message: ex.message } }
    }
  }
}
