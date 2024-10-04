import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";

const useCities = () => {
  const [cities, setCities] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { data, error } = await getAllCities();
        if (error) {
          setError("There was an error");
          return;
        }
        setCities(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return { cities, error, isLoading };
};

export default useCities;

const getAllCities = async () => {
  return axiosInstance
    .get("/user/cities")
    .then((res) => {
      return { data: res.data.data };
    })
    .catch((err) => {
      return { error: err.response?.data?.message || err.message };
    });
};
