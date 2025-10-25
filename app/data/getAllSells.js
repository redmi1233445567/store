import axios from "../utils/axiosConfig";

export async function getAllSells() {
  try {
    const res = await axios.get(`/api/sells`);
    // console.log("All products:", res.data);
    return res.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    return [];
  }
}
