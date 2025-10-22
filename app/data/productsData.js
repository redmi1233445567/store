import axios from "axios";
import url from "./url";


export async function getAllProducts() {
  try {
    const res = await axios.get(`${url}/api/products`,{ withCredentials: true });
    return res.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
    return [];
  }
}
