import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const API_TOPUP_SUBMIT_REQUEST = ENDPOINT + "/api/topup/put";
const API_TOPUP_SUBMIT_OTP = ENDPOINT + "/api/topup/inputotp";

const HEADERS = {
  "Content-Type": "application/json",
};

export async function sendTopUpRequest(data) {
  try {
    const rsp = await axios.put(API_TOPUP_SUBMIT_REQUEST, {
      ...data,
      key: data.signature,
      callbackUri: "https://www.google.com",
      failedUrl: "https://www.google.com",
      clientIp: "127.0.0.1",
      customer: data.requester,
      datetime: dayjs.utc(),
      language: "en-us",
      note: "",
    });
    return rsp.data;
  } catch (ex) {
    if (ex.isAxiosError) {
      return ex.response.data;
    } else {
      return { errors: { exception: ex }, title: "Unexpected error" };
    }
  }
}

export async function sendTopUpOtp(session, otp) {
  try {
    const rsp = await axios.put(API_TOPUP_SUBMIT_OTP, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({
        session,
        otp,
      }),
    });
    return rsp.json();
  } catch (ex) {
    return { errors: { exception: ex }, title: "Unexpected error" };
  }
}
