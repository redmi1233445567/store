import axios from "../utils/axiosConfig";
export async function addProduct(data) {
  try {
    const res = await axios.post(`/api/products`, data);
    return res.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
    return [];
  }
}

