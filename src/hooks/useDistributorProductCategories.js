import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";

function useDistributorProductCategories(distributorId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetchDistributorProductCategories(distributorId)
      .then((result) => {
        if (result.error) {
          setError(result.error);
          return;
        }
        setCategories(result.data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [distributorId]);

  return { productCategories: categories, loading, error };
}

export default useDistributorProductCategories;

async function fetchDistributorProductCategories(distributorId) {
  return axiosInstance
    .post("/product/distributorProductCategories", { distributorId })
    .then((res) => {
      return { data: res.data.data };
    })
    .catch((error) => {
      return { error: error.response?.data?.message || error.message };
    });
}
