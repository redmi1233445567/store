import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://storebacke-zsyk.onrender.com";
// axios.defaults.baseURL = "http://localhost:5000";

export default axios;