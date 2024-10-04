const { default: axiosInstance } = require("../../../../axiosInstance");

exports.addRetailerv3 = async (props) => {
  const { firstName, city, mobile, distributorId, subscriptionEnabled } = props;
  try {
    const { data } = await axiosInstance.post("/retailer/addRetailerv3", {
      firstName,
      mobile,
      city,
      distributorId,
      subscriptionEnabled,
    });
    return { data: data.data };
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

exports.mapRetailerByMobile = async (mobileNo, distributorId) => {
  try {
    const { data } = await axiosInstance.post(
      `/distributor/${distributorId}/mapRetailerByMobile`,
      {
        mobileNo,
      }
    );
    return { data: data.data };
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};
