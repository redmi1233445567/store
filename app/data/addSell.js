import axios from "../utils/axiosConfig";

export async function addSell(data) {
  try {
    const res = await axios.post(`/api/sells`, data);
    // console.log("All products:", res.data);
    return res.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    return [];
  }
}
