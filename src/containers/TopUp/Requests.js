import axios from 'axios'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const API_TOPUP_SUBMIT_REQUEST = '/api/topup/post'
const API_TOPUP_SUBMIT_OTP = '/api/topup/inputotp'

export async function sendTopUpRequest (data) {
  try {
    const rsp = await axios.post(API_TOPUP_SUBMIT_REQUEST, {
      ...data,
      key: data.signature,
      callbackUri: 'https://www.google.com',
      failedUrl: 'https://www.google.com',
      customer: data.requester,
      language: 'en-us',
      note: ''
    })
    return rsp.data
  } catch (ex) {
    if (ex.isAxiosError) {
      return ex.response.data
    } else {
      return { errors: { exception: ex }, title: ex.toString() }
    }
  }
}

export async function sendTopUpOtp (reference, otp) {
  try {
    const rsp = await axios.post(API_TOPUP_SUBMIT_OTP, {
      reference: reference,
      otp: otp
    })
    return rsp.data
  } catch (ex) {
    if (ex.isAxiosError) {
      return ex.response.data
    } else {
      return { errors: { exception: ex }, title: ex.toString() }
    }
  }
}
