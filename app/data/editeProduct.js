import axios from "axios";
import url from "./url";

export async function updateProduct(id, data) {
  try {
    const res = await axios.put(`${url}/api/products/${id}`, data,{ withCredentials: true });
    console.log("Updated product:", res.data);
    return res.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}
