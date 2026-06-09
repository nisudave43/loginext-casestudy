import axios from "axios";

const errorStatusArray = [400, 401, 404, 409, 500, 302];

const getAxiosInstance = () => {
  const instance = axios.create({
    baseURL: "https://case-study-26cf.onrender.com/api",

    // ❌ MUST be false for CORS wildcard APIs
    withCredentials: false,

    timeout: 5000,

    // optional but good for APIs
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => {
      return response?.data?.data ?? response?.data ?? {};
    },
    (error) => {
      const status = error?.response?.status;

      if (axios.isCancel(error)) {
        return Promise.reject(error);
      }

      if (errorStatusArray.includes(status)) {
        return Promise.reject(error?.response?.data || {});
      }

      return Promise.reject({
        message: "Something went wrong",
        status: status || null,
        data: null,
      });
    }
  );

  return instance;
};

export default getAxiosInstance;