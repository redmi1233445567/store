import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://storebacke-zsyk.onrender.com";

export default axios;