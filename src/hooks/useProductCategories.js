import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";

function useProductCategories() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetchCategories()
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
  }, []);
  return { productCategories: categories, loading, error };
}

export default useProductCategories;

async function fetchCategories() {
  return axiosInstance
    .get("/product/categories")
    .then((res) => {
      return { data: res.data.data };
    })
    .catch((error) => {
      return { error: error.response?.data?.message || error.message };
    });
}
