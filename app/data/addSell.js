import axios from "axios";

export async function addSell(data) {
  try {
    const res = await axios.post("http://localhost:5000/api/sells", data,{ withCredentials: true });
    // console.log("All products:", res.data);
    return res.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    return [];
  }
}
