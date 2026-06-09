import getAxiosInstance from "../apis/getAxiosInstance";

/**
 * Parameters required to fetch vehicle details
 */
interface GetVehicleParams {
  id: string;
}

/**
 * Fetch detailed information for a specific vehicle
 *
 * Endpoint: GET /vehicles/:id
 *
 * @param id - Vehicle unique identifier
 * @returns Vehicle detail object (already normalized by axios interceptor)
 */
const getVehicleDetail = async ({ id }: GetVehicleParams) => {
  // Validate required parameter early to avoid unnecessary API calls
  if (!id) {
    return Promise.reject({
      error: true,
      message: "Vehicle id is required",
    });
  }

  // Create axios instance
  const instance = getAxiosInstance();

  // Fetch vehicle details
  const response = await instance.get(`/vehicles/${id}`);

  return response;
};

export default getVehicleDetail;