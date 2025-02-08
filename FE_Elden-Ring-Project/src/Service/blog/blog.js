import axios from "axios";

export const createBlog = async (data) => {
  const token = localStorage.getItem("token");
  try {
    const api = "http://localhost:8080/blog/create";
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
export const updateBlog = async (blogId, data) => {
  const token = localStorage.getItem("token");
  try {
    const api = `http://localhost:8080/blog/update/${blogId}`;
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
export const deleteBlog = async (blogId) => {
  const token = localStorage.getItem("token");
  try {
    const api = `http://localhost:8080/blog/delete/${blogId}`;
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
export const getBlogList = async () => {
  try {
    const api = "http://localhost:8080/blog/list";
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
export const getBlogDetail = async (blogId) => {
  try {
    const api = `http://localhost:8080/blog/${blogId}`;
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
