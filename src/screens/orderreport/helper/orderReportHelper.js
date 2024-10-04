import { endOfDay, startOfDay } from "date-fns";
import axiosInstance from "../../../../axiosInstance";

export const getOrderReport = (distributorId, f_date, t_date, city, status) => {
  const fromDate = startOfDay(f_date);
  const toDate = endOfDay(t_date);

  return axiosInstance
    .post(`/order/report`, {
      distributorId,
      fromDate,
      toDate,
      city,
      status,
    })
    .then((res) => {
      return { data: res.data.data };
    })
    .catch((error) => {
      return { message: error.message };
    });
};
