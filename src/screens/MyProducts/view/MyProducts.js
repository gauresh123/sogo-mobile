import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  RefreshControl,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useAuthContext } from "../../../contexts/authContext";
import useDebounce from "../../../hooks/useDebounce";
import { useProducts } from "../../SalesOrder/helpers/useProducts";
import ProductCategories from "../../SalesOrder/views/ProductCategories";
import Product from "./Product";
import { useSearchContext } from "../../../contexts/SearchContext";

const { height, width } = Dimensions.get("screen");
const PAGE_SIZE = 15;

const MyProducts = ({ navigation }) => {
  const { user } = useAuthContext();
  const [categoryId, setCategoryId] = useState(0);
  const [searchFilter, setSearchFilter] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const { debounceSearch, setSearch } = useSearchContext();

  const {
    products,
    setProducts,
    refreshing,
    error: productsError,
    hasMore,
    triggerRefetch,
  } = useProducts(
    user.distributorId,
    pageNo,
    PAGE_SIZE,
    debounceSearch,
    categoryId
  );

  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => {
      setPageNo(1);
      triggerRefetch();
    });

    return focusListener;
  }, [categoryId, debounceSearch]);

  useEffect(() => {
    let unsubscribeFocus = navigation.addListener("focus", () => {
      setSearch("");
    });

    return unsubscribeFocus;
  }, [navigation]);

  useEffect(() => {
    setProducts([]);
    setPageNo(1);
  }, [debounceSearch, categoryId]);

  const productPress = (item) => {
    navigation.navigate("UpdateProduct", {
      productId: item.productid,
    });
  };
  const handleEndReached = () => {
    if (hasMore) {
      setPageNo((prev) => prev + 1);
    }
  };
  const renderProduct = useCallback(({ item }) => {
    return <Product item={item} productPress={productPress} />;
  }, []);

  return (
    <>
      <View style={styles.container}>
        {/*
        <TextInput
          mode={"outlined"}
          style={styles.input}
          value={searchFilter}
          theme={{ roundness: 10 }}
          placeholder="Search Products"
          onChangeText={(text) => setSearchFilter(text)}
  />*/}
      </View>
      <ProductCategories
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        distributorId={user.distributorId}
      />
      <FlatList
        removeClippedSubviews={false}
        keyboardShouldPersistTaps={"handled"}
        data={products}
        renderItem={renderProduct}
        onEndReachedThreshold={3}
        onEndReached={handleEndReached}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setPageNo(1);
              triggerRefetch();
            }}
          />
        }
        style={{ paddingLeft: 10, paddingRight: 10 }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
  },
  input: {
    width: "100%",
    marginTop: (height * 2) / 100,
  },
});

export default MyProducts;
