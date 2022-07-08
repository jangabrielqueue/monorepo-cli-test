import axios from 'axios'

export async function getScratchCardRates (data) {
  try {
    const rsp = await axios.post('/api/ScratchCard/GetProviderPrecardDetailRates', {
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
