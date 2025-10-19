import axios from "axios";

export async function deleteProduct(id, data) {
  try {
    const res = await axios.delete(`http://localhost:5000/api/products/${id}`,{ withCredentials: true });
    console.log("Updated product:", res.data);
    return res.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}