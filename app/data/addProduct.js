import axios from "axios";
import url from "./url";

export async function addProduct(data) {
  try {
    const res = await axios.post(`${url}/api/products`, data,{ withCredentials: true });
    // console.log("All products:", res.data);
    return res.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
    return [];
  }
}
