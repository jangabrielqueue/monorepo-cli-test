import axios from 'axios'

const API_REQUEST_STATUS = '/api/Deposit/Status?api-version=2.0'

export async function requestStatus (data) {
  try {
    const rsp = await axios.post(API_REQUEST_STATUS, {
      ...data
    })
    return rsp.data
  } catch (ex) {
    if (ex.isAxiosError) {
      return ex.response.data
    } else {
      return { error: { code: '400', message: ex.message } }
    }
  }
}
