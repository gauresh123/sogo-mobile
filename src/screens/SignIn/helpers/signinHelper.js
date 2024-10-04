import axiosInstance from "../../../../axiosInstance.js";

export const signIn = async ({ mobile_no, pin }) => {
  return axiosInstance
    .post("/user/signIn", { mobile_no, pin })
    .then((res) => {
      return { message: res.data.message, data: res.data.data };
    })
    .catch((err) => {
      return { error: err.response?.data?.message || err.message, data: {} };
    });
};

export const signUp = async ({ mobile_no }) => {
  return axiosInstance
    .post("/user/signUp", { mobile_no })
    .then((res) => {
      return { data: res.data.message };
    })
    .catch((err) => {
      if (err.response?.status !== 400) {
        return { error: err.response?.data?.message || "Error", data: {} };
      } else {
        return { error: "Error", data: {} };
      }
    });
};

export const updatePin = async ({ mobile_no, pin }) => {
  return axiosInstance
    .put("/user/updatePin", { mobile_no, pin })
    .then((res) => {
      return { message: res.data.message, data: {} };
    })
    .catch((err) => {
      return { error: err.response?.data?.message || err.message, data: {} };
    });
};
