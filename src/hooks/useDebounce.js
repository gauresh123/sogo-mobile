import { useEffect, useState } from "react";

const useDebounce = (value, time = 250) => {
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, time);

    return () => clearTimeout(timeout);
  }, [value, time]);

  return debouncedValue;
};

export default useDebounce;
