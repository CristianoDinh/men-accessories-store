import axios from "axios";

export const createProduct = async (data) => {
  const token = localStorage.getItem("token");
  try {
    const api = "http://localhost:8080/product/create";
    const res = await axios.post(api, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const updateProduct = async (productId, data) => {
  const token = localStorage.getItem("token");
  try {
    const api = `http://localhost:8080/product/update/${productId}`;
    const res = await axios.put(api, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const deleteProduct = async (productId) => {
  const token = localStorage.getItem("token");
  try {
    const api = `http://localhost:8080/product/delete/${productId}`;
    const res = await axios.delete(api, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
export const getAllProduct = async () => {
  const token = localStorage.getItem("token");
  try {
    const api = "http://localhost:8080/product/list";
    const res = await axios.get(api, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data.result;
  } catch (error) {
    return error;
  }
};
export const getAllShop = async () => {
  try {
    const api = "http://localhost:8080/product/shop";
    const res = await axios.get(api, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data.result;
  } catch (error) {
    return error;
  }
};
export const getProductDetail = async (productId) => {
  try {
    const api = `http://localhost:8080/product/${productId}`;
    const res = await axios.get(api, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data.result;
  } catch (error) {
    console.log(error);
    return error;
  }
};
