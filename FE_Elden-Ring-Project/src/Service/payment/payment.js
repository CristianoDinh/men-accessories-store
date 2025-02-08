import axios from "axios";

export const createCheckout = async (data) => {
  const token = localStorage.getItem("token");
  try {
    const api = "http://localhost:8080/payment/create/checkout";
    const res = await axios.post(api, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.data && res.data.result && res.data.result.approval_url) {
      window.location.href = res.data.result.approval_url;
    }
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};
export const createBuynow = async (data) => {
  const token = localStorage.getItem("token");
  try {
    const api = "http://localhost:8080/payment/create/buy-now";
    const res = await axios.post(api, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.data && res.data.result && res.data.result.approval_url) {
      window.location.href = res.data.result.approval_url;
    }
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};
export const rejectOrder = async (data) => {
  const token = localStorage.getItem("token");
  try {
    const api = "http://localhost:8080/payment/void";
    const res = await axios.post(api, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};
export const approveOrder = async (data) => {
  const token = localStorage.getItem("token");
  try {
    const api = "http://localhost:8080/payment/capture";
    const res = await axios.post(api, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};
