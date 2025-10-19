import axios from "axios";

export async function getAllSells() {
  try {
    const res = await axios.get("http://localhost:5000/api/sells",{ withCredentials: true });
    // console.log("All products:", res.data);
    return res.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    return [];
  }
}
