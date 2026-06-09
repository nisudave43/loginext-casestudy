import getAxiosInstance from "../apis/getAxiosInstance";

/**
 * Query parameters for fetching vehicle list
 */
interface GetVehicleParams {
  limit?: number;
  status?: string;
}

/**
 * Fetch list of vehicles with optional filters
 *
 * Endpoint: GET /vehicles
 *
 * @param limit - number of vehicles to fetch
 * @param status - vehicle status filter (e.g. active, idle, delivered)
 *                "all" means no filter applied
 * @returns List of vehicles
 */
const getVehicleInformation = async ({
  limit,
  status,
}: GetVehicleParams) => {
  // Create axios instance
  const instance = getAxiosInstance();

  // Build query params dynamically
  const params: Record<string, any> = {};

  if (typeof limit === "number") {
    params.limit = limit;
  }

  if (status && status !== "all") {
    params.status = status;
  }

  // API call with query parameters
  const response = await instance.get("/vehicles", { params });

  return response;
};

export default getVehicleInformation;