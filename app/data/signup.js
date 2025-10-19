import axios from "axios";

export async function signup(data) {
  try {
    const res = await axios.post("http://localhost:5000/api/signup", data);
    return res.data;
  } catch (err) {
    console.log(err.response?.data.errors || err.message);
    return [err.response?.data];
  }
}
