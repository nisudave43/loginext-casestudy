import getAxiosInstance from "../apis/getAxiosInstance";

/**
 * Fetches system/statistics data from backend API
 * 
 * Endpoint: GET /statistics
 * 
 * @returns Promise resolving to statistics data (already unwrapped by interceptor)
 */
const getStatistics = async () => {
  // Create a fresh Axios instance for this request
  const instance = getAxiosInstance();

  // Call statistics API endpoint
  return instance.get("/statistics");
};

export default getStatistics;