import axios from "axios";

export const getListCategory = async () => {
  try {
    const api = "http://localhost:8080/category/list";
    const res = await axios.get(api, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data.result;
  } catch (error) {
    return error.response.data;
  }
};

export const getProductByCateId = async (cateId) => {
  try {
    const api = `http://localhost:8080/category/${cateId}`;
    const res = await axios.get(api, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data.result.products;
  } catch (error) {
    return error.response.data;
  }
};
export const getProductShopByCateId = async (cateId) => {
  try {
    const api = `http://localhost:8080/category/shop/${cateId}`;
    const res = await axios.get(api, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data.result.products;
  } catch (error) {
    return error.response.data;
  }
};
