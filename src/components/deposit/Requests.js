const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const API_TOPUP_SUBMIT_REQUEST = ENDPOINT + "/topup/topup";
const API_TOPUP_SUBMIT_OTP = ENDPOINT + "/topup/topupinputotp";

const HEADERS = {
  "Content-Type": "application/json",
};

export async function sendTopUpRequest(data) {
  try {
    const rsp = await fetch(API_TOPUP_SUBMIT_REQUEST, {
      method: "PUT",
      headers: HEADERS,
      body: JSON.stringify(data),
    });
    return rsp.json();
  } catch (ex) {
    return { error: ex };
  }
}

export async function sendTopUpOtp(session, otp) {
  try {
    const rsp = await fetch(API_TOPUP_SUBMIT_OTP, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({
        session,
        otp,
      }),
    });
    return rsp.json();
  } catch (ex) {
    return { error: ex };
  }
}
