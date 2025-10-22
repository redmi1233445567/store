import axios from "axios";
import url from "./url";

export async function signup(data) {
  try {
    const res = await axios.post(`${url}/api/signup`, data);
    return res.data;
  } catch (err) {
    console.log(err.response?.data.errors || err.message);
    return [err.response?.data];
  }
}
