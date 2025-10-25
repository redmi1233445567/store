import axios from "../utils/axiosConfig";

export async function deleteProduct(id, data) {
  try {
    const res = await axios.delete(`/api/products/${id}`);
    console.log("Updated product:", res.data);
    return res.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}