import axios from "axios";

/**
 * List of HTTP status codes that we explicitly handle
 * and forward error response from backend as-is.
 */
const ERROR_STATUS_CODES = [400, 401, 404, 409, 500, 302];

/**
 * Creates a pre-configured Axios instance
 * with base settings + interceptors.
 */
const getAxiosInstance = () => {
  const instance = axios.create({
    // Base API URL for all requests
    baseURL: "https://case-study-26cf.onrender.com/api",

    /**
     * Important:
     * Set false when backend allows CORS from wildcard (*)
     * or when cookies are not required.
     */
    withCredentials: false,

    // Request timeout (ms)
    timeout: 10000,

    // Default headers for all requests
    headers: {
      "Content-Type": "application/json",
    },
  });

  /**
   * Request interceptor
   * Use this to attach tokens, logging, etc.
   */
  instance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  /**
   * Response interceptor
   * Normalizes API response structure and error handling
   */
  instance.interceptors.response.use(
    (response) => {
      /**
       * Standardized response unwrapping:
       * - If backend sends { data: { data: ... } } → return inner data
       * - Else fallback to response.data
       * - Else return empty object
       */
      return response?.data?.data ?? response?.data ?? {};
    },
    (error) => {
      const status = error?.response?.status;

      /**
       * Handle request cancellation separately
       * (e.g., AbortController / axios cancel token)
       */
      if (axios.isCancel(error)) {
        return Promise.reject(error);
      }

      /**
       * If status is in known error list,
       * return backend-provided error payload
       */
      if (ERROR_STATUS_CODES.includes(status)) {
        return Promise.reject(error?.response?.data || {});
      }

      /**
       * Fallback for unknown/unhandled errors
       * (network error, timeout, etc.)
       */
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