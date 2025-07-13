import axios from "axios";
import { toast } from 'react-toastify';

const token = localStorage.getItem("token");

const axiosInstance = axios.create({
  baseURL: "https://mytshop.runasp.net/api/",
  headers: {
     Authorization: `Bearer ${token}`
  },
  timeout: 10000, 
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.message || error.message || "خطأ غير معروف";
    toast.error(msg);
    return Promise.reject(error);
  }
);

export default axiosInstance;
