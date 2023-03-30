import axios from 'axios'

const API_DEPOSIT_SUBMIT_REQUEST = '/api/deposit/post?api-version=2.0'
const API_DEPOSIT_SUBMIT_OTP = '/api/deposit/inputotp?api-version=2.0'

export async function sendDepositRequest (data) {
  try {
    const rsp = await axios.post(API_DEPOSIT_SUBMIT_REQUEST, {
      ...data,
      key: data.signature,
      customer: data.requester
    })
    return rsp.data
  } catch (ex) {
    if (ex.isAxiosError) {
      return ex.response.data
    } else {
      return { error: { code: 'UnknownException', message: ex.message } }
    }
  }
}

export async function sendDepositOtp (reference, otp) {
  try {
    const rsp = await axios.post(API_DEPOSIT_SUBMIT_OTP, {
      reference: reference,
      otp: otp
    })
    return rsp.data
  } catch (ex) {
    if (ex.isAxiosError) {
      return ex.response.data
    } else {
      return { error: { code: 'UnknownException', message: ex.message } }
    }
  }
}
