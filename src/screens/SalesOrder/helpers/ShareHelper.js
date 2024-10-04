import axiosInstance from "../../../../axiosInstance";

export const createForm = async (distributorId, retailerId) => {
  return axiosInstance
    .post("/form/create", {
      distributorId,
      retailerId,
    })
    .then((res) => {
      const data = res.data.data;
      return { data: data };
    })
    .catch((err) => {
      return { error: err.message };
    });
};
