import axios from "axios";

export async function addProduct(data) {
  try {
    const res = await axios.post("http://localhost:5000/api/products", data,{ withCredentials: true });
    // console.log("All products:", res.data);
    return res.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
    return [];
  }
}
