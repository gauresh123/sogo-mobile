import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  View,
  RefreshControl,
} from "react-native";
import { Button, HelperText } from "react-native-paper";
import { TextInput, Text } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuthContext } from "../../../contexts/authContext";
import { getOrderDetails } from "../helpers/salesOrderHelper";
import Product from "./Product";
import { useProducts } from "../helpers/useProducts";
import useDebounce from "../../../hooks/useDebounce";
import { useCartContext } from "../../../contexts/CartContext";
import ProductCategories from "./ProductCategories";
import EditProductPopup from "./EditProductPopup";
import ProductDetail from "./ProductDetail";
import { useSearchContext } from "../../../contexts/SearchContext";

const PAGE_SIZE = 15;

function UpdateOrder({ navigation, route }) {
  const { user, setRouteName } = useAuthContext();
  const { order } = route.params;
  const { debounceSearch } = useSearchContext();

  const {
    cartItems,
    setCartItems,
    cartInfo,
    setCartInfo,
    clearCartContext,
    showSingleProduct,
  } = useCartContext();
  const [categoryId, setCategoryId] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [editProduct, setEditProduct] = useState(null);
  const {
    products,
    setProducts,
    refreshing,
    error: productsError,
    hasMore,
  } = useProducts(
    user.distributorId,
    pageNo,
    PAGE_SIZE,
    debounceSearch,
    categoryId,
    false
  );
  const [errors, setErrors] = useState({});
  const RNNavigation = useNavigation();
  const updateOrderRoute = useRoute();

  useEffect(() => {
    setProducts([]);
    setPageNo(1);
  }, [debounceSearch, categoryId]);

  useEffect(() => {
    clearCartContext();
    setCartInfo({
      action: "update",
      retailerId: order.retailerid,
      retailerName: order.name,
      orderId: order.orderid,
      discount: 0,
    });
    getCartProducts();
  }, []);

  useEffect(() => {
    setRouteName(updateOrderRoute.name);
    const unsubscribeFocus = navigation.addListener("focus", () => {
      RNNavigation.reset({
        index: 0,
        routes: [{ name: "LandingPage" }],
      });
    });
    return unsubscribeFocus;
  }, [navigation]);

  const handleEndReached = () => {
    if (hasMore) {
      setPageNo((prev) => prev + 1);
    }
  };

  useEffect(() => {
    clearCartContext();
    setCartInfo({
      action: "update",
      retailerId: order.retailerid,
      retailerName: order.name,
      orderId: order.orderid,
      discount: 0,
    });
    getCartProducts();
  }, []);

  async function getCartProducts() {
    try {
      const orderDetails = await getOrderDetails(
        user.distributorId,
        order.orderid
      );
      if (!orderDetails.error) {
        const cart = orderDetails.data.map((item) => ({
          discount: item.discount,
          price: item.productprice,
          productid: item.productid,
          quantity: item.productquantity,
          productname: item.productname,
          orderstatus: item.orderstatus,
          manufacturer: item.manufacturer,
          gstrate: item.productgstrate,
        }));
        setCartInfo((prev) => ({
          ...prev,
          retailerId: orderDetails.data[0]?.retailerid,
        }));
        setCartItems(cart);
      }
    } catch (err) {
      setErrors({ ...errors, cart: "Failed to get products" });
    }
  }

  const goToCart = () => {
    if (cartItems.filter((item) => item.quantity > 0).length <= 0) {
      Alert.alert("Empty cart", "Please add some products");
      return;
    }
    navigation.navigate("Orders", { screen: "Cart" });
  };

  const renderProduct = useCallback(({ item }) => {
    return <Product item={item} setEditProduct={setEditProduct} />;
  }, []);

  const productKeyExtractor = useCallback((product) => product.productid, []);

  return (
    <>
      <View style={styles.heading}>
        <View style={styles.flexContainer}>
          <Text style={{ width: "80%" }} variant="titleMedium">
            <Text style={{ color: "gray" }}>Customer:</Text>{" "}
            {cartInfo.retailerName}
          </Text>
          <Text
            variant="titleMedium"
            style={{ width: "20%", textAlign: "right" }}
          >
            ID: {cartInfo.orderId}
          </Text>
        </View>
      </View>
      {/*
      <TextInput
        value={searchFilter}
        mode="outlined"
        theme={{ roundness: 10 }}
        style={{ marginHorizontal: 8, marginBottom: 5 }}
        placeholder="Search Products"
        onChangeText={(text) => setSearchFilter(text)}
  />*/}
      <ProductCategories
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        distributorId={user.distributorId}
      />
      {errors.products && (
        <HelperText visible={errors.products} type="error">
          {errors.products}{" "}
        </HelperText>
      )}
      <FlatList
        removeClippedSubviews={false}
        keyExtractor={productKeyExtractor}
        data={products}
        renderItem={renderProduct}
        onEndReached={handleEndReached}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setPageNo(1)}
          />
        }
      />
      <EditProductPopup
        editProduct={editProduct}
        setEditProduct={setEditProduct}
      />
      <Button onPress={goToCart} mode="contained" style={styles.orderButton}>
        Proceed
      </Button>
      {showSingleProduct && <ProductDetail />}
    </>
  );
}

export default UpdateOrder;

const styles = StyleSheet.create({
  heading: {
    padding: 10,
    paddingBottom: 5,
  },
  orderButton: {
    borderRadius: 3,
    paddingVertical: 5,
  },
  flexContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
