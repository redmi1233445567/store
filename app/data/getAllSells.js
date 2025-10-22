import axios from "axios";
import url from "./url";

export async function getAllSells() {
  try {
    const res = await axios.get(`${url}/api/sells`,{ withCredentials: true });
    // console.log("All products:", res.data);
    return res.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    return [];
  }
}
