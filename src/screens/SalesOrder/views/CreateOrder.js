import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  View,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Button, HelperText, useTheme } from "react-native-paper";
import { TextInput, Text } from "react-native-paper";
import { useAuthContext } from "../../../contexts/authContext";
import Product from "./Product";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import ShareLink from "../../../component/Share";
import { useProducts } from "../helpers/useProducts";
import useDebounce from "../../../hooks/useDebounce";
import { useCartContext } from "../../../contexts/CartContext";
import ProductCategories from "./ProductCategories";
import EditProductPopup from "./EditProductPopup";
import ProductDetail from "./ProductDetail";
import DatePicker from "../../../component/DatePicker";
import { useSearchContext } from "../../../contexts/SearchContext";
import Options from "./Options";

const { height } = Dimensions.get("screen");

const PAGE_SIZE = 15;

function CreateOrder({ route, navigation }) {
  const { user } = useAuthContext();
  const theme = useTheme();
  const { retailerId, retailerName, retailerNumber, subscriptionenabled } =
    route.params;
  const {
    cartInfo,
    cartItems,
    setCartInfo,
    clearCartContext,
    showSingleProduct,
    setCartItems,
  } = useCartContext();
  const { debounceSearch, setSearch } = useSearchContext();
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
  const [show, setShow] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    setCartInfo({
      action: "place",
      retailerId,
      retailerName,
    });
  }, []);

  useEffect(() => {
    if (cartInfo.action == "subscribe") {
      const unsubscribeFocus = navigation.addListener("focus", () => {
        setCartInfo((prev) => ({ ...prev, action: "place" }));
        setCartItems([]);
      });
      return unsubscribeFocus;
    }
  }, [cartInfo]);

  useEffect(() => {
    setProducts([]);
    setPageNo(1);
  }, [debounceSearch, categoryId]);

  const handleEndReached = () => {
    if (hasMore) {
      setPageNo((prev) => prev + 1);
    }
  };

  const goToCart = () => {
    if (cartItems.filter((item) => item.quantity > 0).length <= 0) {
      Alert.alert("Empty cart", "Please add some products");
      return;
    }
    navigation.navigate("Home", { screen: "Cart" });
  };

  const subscribtionPressed = () => {
    clearCartContext();
    navigation.navigate(`CreatSubOrder`, {
      retailerName: retailerName,
      retailerId: retailerId,
      retailerNumber: retailerNumber,
    });
    setCartInfo({
      action: "subscribe",
      retailerId,
      retailerName,
    });
    setShowOptions(false);
    setSearch("");
  };
  const showShare = () => {
    setShow(true);
    setShowOptions(false);
  };
  const renderProduct = useCallback(({ item }) => {
    return <Product item={item} setEditProduct={setEditProduct} />;
  }, []);

  const productKeyExtractor = useCallback((product) => product.productid, []);

  return (
    <>
      <View style={styles.heading}>
        <View style={styles.flexContainer}>
          <Text
            variant="titleMedium"
            style={{ width: "80%", paddingBottom: 5 }}
          >
            <Text style={{ color: "gray" }}>Customer: </Text>
            {retailerName}
            {subscriptionenabled && "(Subscribed)"}
          </Text>
          <TouchableOpacity onPress={() => setShowOptions(true)}>
            <Entypo name="menu" size={30} color={theme.colors.primary} />
          </TouchableOpacity>
          {/*
          <View onStartShouldSetResponder={() => setShow(true)}>
            <Text variant="titleMedium">
              <MaterialCommunityIcons
                name="share"
                size={(height * 2.5) / 100}
                color="gray"
              />{" "}
              Share
            </Text>
  </View>*/}
        </View>
        {/*
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {subscriptionenabled && (
            <Text
              style={{
                color: "white",
                alignSelf: "flex-start",
                paddingVertical: 5,
                paddingHorizontal: 8,
                backgroundColor: theme.colors.primary,
                marginTop: 5,
                marginBottom: 5,
                borderRadius: 8,
              }}
              onPress={subscribtionPressed}
            >
              Subscribable Products
            </Text>
          )}
          <View
            style={{
              alignSelf: "center",
              borderRadius: 5,
              borderColor: "gray",
              borderWidth: 1,
            }}
          >
            <DatePicker
              date={date}
              setDate={setDate}
              text={"From"}
              showFlag={true}
            />
          </View>
        </View>*/}
      </View>
      {/*
      <TextInput
        value={searchFilter}
        theme={{ roundness: 10 }}
        style={{ marginHorizontal: 8, marginBottom: 5 }}
        mode="outlined"
        placeholder="Search Products"
        onChangeText={(text) => setSearchFilter(text)}
        editable={show ? false : true}
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
        onEndReachedThreshold={3}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setPageNo(1)}
          />
        }
      />

      <ShareLink
        visible={show}
        onDismiss={() => setShow(false)}
        retailerId={retailerId}
        retailerNumber={retailerNumber}
      />

      <Options
        visible={showOptions}
        onDismiss={() => setShowOptions(false)}
        showShare={showShare}
        subscriptionOrder={subscribtionPressed}
        subscriptionenabled={subscriptionenabled}
      />

      <EditProductPopup
        editProduct={editProduct}
        setEditProduct={setEditProduct}
      />
      <Button onPress={goToCart} mode="contained" style={styles.orderButton}>
        Add to Cart
      </Button>
      {showSingleProduct && <ProductDetail />}
    </>
  );
}

export default CreateOrder;

const styles = StyleSheet.create({
  heading: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    paddingBottom: 0,
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
  bgbutton: {
    color: "white",
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 8,
  },
});
