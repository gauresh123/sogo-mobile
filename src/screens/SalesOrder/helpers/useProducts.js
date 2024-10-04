import { useState, useEffect } from "react";
import { fetchProducts } from "./salesOrderHelper";

export const useProducts = (
  distributorId,
  pageNo,
  pageSize,
  searchText = "ALL",
  categoryId,
  subscriptionOnly
) => {
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [toggle, setToggle] = useState(true);

  const triggerRefetch = () => {
    setToggle((prev) => !prev);
  };

  const getProducts = async (signal) => {
    setRefreshing(true);
    try {
      const products = await fetchProducts(
        distributorId,
        categoryId,
        searchText,
        pageNo,
        pageSize,
        subscriptionOnly,
        { signal }
      );
      if (products.error) {
        return;
      }
      if (products.data.length === 0 && pageNo === 1) {
        setError("No products found");
      } else {
        if (pageNo === 1) {
          setProducts(products.data);
        } else {
          setProducts((prev) => [...prev, ...products.data]);
        }
      }
      setHasMore(Number(products.data[0]?.totalpages) > pageNo);
    } catch (err) {
      setError("Failed to get products");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    if (!distributorId) return;
    setError("");
    getProducts(controller.signal);

    return () => controller.abort();
  }, [distributorId, categoryId, searchText, pageNo, toggle, subscriptionOnly]);

  return {
    products,
    refreshing,
    error,
    setProducts,
    hasMore,
    getProducts,
    triggerRefetch,
  };
};
