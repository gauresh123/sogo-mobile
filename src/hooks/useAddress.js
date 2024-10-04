import { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";

const ADDRESS_SCHEMA = {
  street1: "",
  street2: "",
  landmark: "",
  city: "",
  district: "",
  state: "",
  zipcode: "",
};

const useAddress = (userId) => {
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(ADDRESS_SCHEMA);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setError("");
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/user/${userId}/address`);
        const responseData = response.data.data;
        setAddress(responseData);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const updateAddress = async (address) => {
    delete address.userid;
    try {
      const result = await axiosInstance.put(
        `/user/${userId}/address`,
        address
      );
      setAddress(result.data);
      return result;
    } catch (error) {
      return { error: error.response?.data?.message || error.message };
    }
  };

  return { address, loading, error, setAddress, updateAddress };
};

export default useAddress;
