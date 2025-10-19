import axios from "axios";


export async function getAllProducts() {
  try {
    const res = await axios.get("http://localhost:5000/api/products",{ withCredentials: true });
    return res.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
    return [];
  }
}
