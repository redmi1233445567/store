import axios from "../utils/axiosConfig";


export async function getAllProducts() {
  try {
    const res = await axios.get(`/api/products`);
    return res.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
    return [];
  }
}
