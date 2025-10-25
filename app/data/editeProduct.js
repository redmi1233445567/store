import axios from "../utils/axiosConfig";

export async function updateProduct(id, data) {
  try {
    const res = await axios.put(`/api/products/${id}`, data);
    console.log("Updated product:", res.data);
    return res.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}
