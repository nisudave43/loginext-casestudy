import getAxiosInstance from "../apis/getAxiosInstance";

interface GetVehicleParams {
  id: string;
}

const getVehicleDetail = async ({ id }: GetVehicleParams) => {
  const instance = getAxiosInstance();

  if (!id) {
    return Promise.reject({
      error: true,
      message: "Vehicle id is required",
    });
  }

  const response = await instance.get(`/vehicles/${id}`);

  return response;
};

export default getVehicleDetail;