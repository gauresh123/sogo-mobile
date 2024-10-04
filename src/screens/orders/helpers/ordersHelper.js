import { endOfDay, format, startOfDay } from "date-fns";
import axiosInstance from "../../../../axiosInstance";

export const getOrders = async (
  distributorId,
  fromdate,
  todate,
  city,
  status
) => {
  return axiosInstance
    .post("/order/v2", {
      user_id: distributorId,
      fromDate: startOfDay(new Date(fromdate)),
      toDate: endOfDay(new Date(todate)),
      city: city,
      status: status,
    })
    .then((res) => {
      return { data: res.data.data };
    })
    .catch((err) => {
      return { message: err.message };
    });
};

export const getOrderStatus = async () => {
  return axiosInstance
    .get("/order/orderStatus")
    .then((res) => {
      return { data: res.data.data };
    })
    .catch((err) => {
      return { message: err.message };
    });
};

export const editOrderStatus = async (orderId, orderStatusId, orderStatus) => {
  return axiosInstance
    .put("/order/editOrderStatus", { orderId, orderStatusId, orderStatus })
    .then((res) => {
      return { data: res.data.data };
    })
    .catch((err) => {
      return { message: err.response?.data?.message || err.message };
    });
};

export const addRetailer = async (mobile, name, address) => {
  return axiosInstance
    .post("/retailer/addRetailer", { mobile, name, address })
    .then((res) => {
      if (
        res.data.data &&
        res.data.data.length &&
        res.data.data[0].messages === "Duplicate Mobile Numeber, Please Verify"
      ) {
        return {
          success: false,
          message: "Duplicate Mobile Number, Please Verify",
        };
      } else {
        return { success: true, data: res.data.data };
      }
    })
    .catch((err) => {
      return { success: false, message: err.message };
    });
};

export const getOrderSummary = async (distributorId, date) => {
  const formatDate = format(date, "yyyy-MM-dd");
  return axiosInstance
    .post(`/order/summary`, { userId: distributorId, date: formatDate })
    .then((res) => {
      return { data: res.data.data };
    })
    .catch((err) => {
      return { message: err.message };
    });
};

export const downloadOrderSummary = async (distributorId, date) => {
  const formatDate = format(date, "yyyy-MM-dd");
  return axiosInstance
    .post(
      `/order/download/summary`,
      { userId: distributorId, date: formatDate },
      { responseType: "blob" }
    )
    .then((res) => {
      return {
        data: res.data,
      };
    })
    .catch((err) => {
      return { message: err.message };
    });
};

export const editOrderPaymentStatus = async (orderId, isPaid) => {
  return axiosInstance
    .put(`/order/${orderId}/paymentStatus`, { isPaid })
    .then((res) => {
      return { data: res.data.data };
    })
    .catch((err) => {
      return { message: err.response?.data?.message || err.message };
    });
};

export const getLastOrderDate = async (distributorId) => {
  try {
    const { data } = await axiosInstance.get(
      `/distributor/${distributorId}/lastOrderDate`
    );
    return { data: data.data };
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};
