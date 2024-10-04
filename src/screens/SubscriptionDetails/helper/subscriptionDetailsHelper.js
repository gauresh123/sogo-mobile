import axiosInstance from "../../../../axiosInstance";

export async function updateSubscription(retailerId, distributorId, products) {
  try {
    const result = await axiosInstance.put("/subscription", {
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
