import axiosInstance from "../../../../axiosInstance";

export const getDistributorUsers = async (distributorId) => {
  return axiosInstance
    .get(`/distributor/${distributorId}/users`)
    .then((res) => {
      return { data: res.data.data };
    })
    .catch((err) => {
      return { message: err.message };
    });
};

export const addUser = async (
  distributorId,
  userName,
  mobileNo,
  city,
  subroleId
) => {
  return axiosInstance
    .post(`/distributor/${distributorId}/user`, {
      distributorId,
      userName,
      mobileNo,
      city,
      subroleId,
    })
    .then((res) => {
      return { data: res.data.data };
    })
    .catch((err) => {
      return { message: err.response?.data?.message || err.message };
    });
};

export const editUserData = async (
  userid,
  userName,
  mobileNo,
  city,
  roleId,
  subroleId
) => {
  return axiosInstance
    .put(`/user/${userid}`, {
      userName,
      mobileNo,
      city,
      roleId,
      subroleId,
    })
    .then((res) => {
      return { data: res.data.data };
    })
    .catch((err) => {
      return { message: err.response?.data?.message || err.message };
    });
};
