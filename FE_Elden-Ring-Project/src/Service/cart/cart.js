import axios from "axios";

export const createCart = async (data) => {
  const token = localStorage.getItem("token");
  try {
    const api = "http://localhost:8080/cart/create";
    const res = await axios.post(api, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    localStorage.setItem("cartId", res.data.result.cartId);
    return res.data;
  } catch (error) {
    return error.response.data;
  }
};
export const addToCart = async (cartId, productId, data) => {
  const token = localStorage.getItem("token");
  try {
    const api = `http://localhost:8080/cart/${cartId}/add/${productId}`;
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
export const getMyCart = async (userId) => {
  const token = localStorage.getItem("token");
  try {
    const api = `http://localhost:8080/cart/user/${userId}`;
    const res = await axios.get(api, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data.result;
  } catch (error) {
    return error.response.data;
  }
};
export const removeItemFromCart = async (cartItemId) => {
  const token = localStorage.getItem("token");
  try {
    const api = `http://localhost:8080/cart/delete/${cartItemId}`;
    const res = await axios.delete(api, {
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
export const updateQuantityItem = async (cartId, cartItemId, quantity) => {
  const token = localStorage.getItem("token");
  try {
    const api = `http://localhost:8080/cart/${cartId}/update/${cartItemId}`;
    const res = await axios.put(api, quantity, {
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
