import axios from "axios";
import url from "./url";

export async function addSell(data) {
  try {
    const res = await axios.post(`${url}/api/sells`, data,{ withCredentials: true });
    // console.log("All products:", res.data);
    return res.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    return [];
  }
}
