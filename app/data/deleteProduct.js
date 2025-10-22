import axios from "axios";
import url from "./url";

export async function deleteProduct(id, data) {
  try {
    const res = await axios.delete(`${url}/api/products/${id}`,{ withCredentials: true });
    console.log("Updated product:", res.data);
    return res.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}