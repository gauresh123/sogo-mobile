import axios from "axios";
import { SOGO_API_URL } from "./src/constants/constants";

const axiosInstance = axios.create({
  baseURL: SOGO_API_URL,
});

export default axiosInstance;
