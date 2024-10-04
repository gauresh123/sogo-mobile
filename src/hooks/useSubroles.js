import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";

const useSubroles = () => {
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { data, error } = await getSubRoles();
        if (error) {
          setError("There was an error");
          return;
        }
        setRoles(
          data.map((val) => {
            const newData = {
              name: val.subrole,
              value: val.subroleid,
              id: val.subroleid,
            };
            return newData;
          })
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return { roles, error, isLoading };
};

export default useSubroles;

const getSubRoles = async () => {
  return axiosInstance
    .get("/distributor/subroles")
    .then((res) => {
      return { data: res.data.data };
    })
    .catch((err) => {
      return { error: err.response?.data?.message || err.message };
    });
};
