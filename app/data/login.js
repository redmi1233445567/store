import axios from "../utils/axiosConfig";

export async function login(data) {
  try {
    const res = await axios.post(`/api/login`, data);
    return res.data;
  } catch (err) {
    console.log(err.response?.data.errors || err.message);
    return [err.response?.data];
  }
}
