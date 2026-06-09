import getAxiosInstance from "../apis/getAxiosInstance";

interface GetVehicleParams {
  limit?: number;
  status?: string;
}

const getVehicleInformation = async ({ limit, status }: GetVehicleParams) => {
  const instance = getAxiosInstance();

  const params: Record<string, any> = {};

  if (limit) params.limit = limit;
  if (status && status !== "all") params.status = status;

  const response = await instance.get("/vehicles", { params });

  return response;
};

export default getVehicleInformation;