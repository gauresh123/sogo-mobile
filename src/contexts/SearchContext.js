import { createContext, useContext, useState } from "react";
import useDebounce from "../hooks/useDebounce";

const SearchContext = createContext();

const SearchContextProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [shown, setShown] = useState(false);
  const debounceSearch = useDebounce(search);
  return (
    <SearchContext.Provider
      value={{ search, setSearch, debounceSearch, shown, setShown }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContextProvider;
export const useSearchContext = () => useContext(SearchContext);
