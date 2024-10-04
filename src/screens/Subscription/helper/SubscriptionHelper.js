import axiosInstance from "../../../../axiosInstance";

export const getSubscribedRetailers = async (distributorId) => {
  return axiosInstance
    .get(`/distributor/${distributorId}/subscriptions/retailers`)
    .then((res) => {
      return { data: res.data.data };
    })
    .catch((err) => {
      return { error: err.message };
    });
};

export const getSubscriptionDetails = async (distributorId, retailerId) => {
  return axiosInstance
    .get(`/subscription/distributor/${distributorId}/retailer/${retailerId}`)
    .then((res) => {
      return { data: res.data.data };
    })
    .catch((err) => {
      return { error: err.message };
    });
};

export async function addSubscription(retailerId, distributorId, products) {
  try {
    const result = await axiosInstance.post("/subscription", {
      retailerId,
      distributorId,
      products,
    });
    const data = result.data.data;
    return data;
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
}
