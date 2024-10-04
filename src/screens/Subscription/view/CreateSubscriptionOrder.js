import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  View,
  RefreshControl,
} from "react-native";
import { Button, HelperText } from "react-native-paper";
import { Text } from "react-native-paper";
import { useAuthContext } from "../../../contexts/authContext";
import { useCartContext } from "../../../contexts/CartContext";
import { useProducts } from "../../SalesOrder/helpers/useProducts";

import ProductCategories from "../../SalesOrder/views/ProductCategories";
import EditProductPopup from "../../SalesOrder/views/EditProductPopup";
import ProductDetail from "../../SalesOrder/views/ProductDetail";
import ShareLink from "../../../component/Share";
import SubscribeProduct from "./SubscribeProduct";
import SubscriptionModal from "./SubscriptionModal";
import { validateSubscriptionProduct } from "../../SalesOrder/helpers/salesOrderHelper";
import { useSearchContext } from "../../../contexts/SearchContext";
import { addSubscription } from "../helper/SubscriptionHelper";

const PAGE_SIZE = 15;

const CreateSubscriptionOrder = ({ route, navigation }) => {
  const { user } = useAuthContext();
  const [uploading, setUploading] = useState(false);
  const { retailerId, retailerNumber, retailerName } = route.params;
  const { cartInfo, cartItems, showSingleProduct, setCartItems } =
    useCartContext();
  const [categoryId, setCategoryId] = useState(0);
  const [subscriptionProduct, setSubscriptionProduct] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [editProduct, setEditProduct] = useState(null);
  const [showSubscription, setShowSubscription] = useState(false);
  const { debounceSearch } = useSearchContext();

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
    true
  );
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);

  useEffect(() => {
    setProducts([]);
    setPageNo(1);
  }, [debounceSearch, categoryId]);

  const handleEndReached = () => {
    if (hasMore) {
      setPageNo((prev) => prev + 1);
    }
  };

  const handleAddSubscription = async () => {
    if (
      cartItems.filter((item) => validateSubscriptionProduct(item)).length <= 0
    ) {
      Alert.alert("Empty cart", "Please add some products");
      return;
    }

    setErrors({ ...errors, saveOrder: "" });
    if (cartItems.length === 0) {
      Alert.alert(
        "Empty cart!",
        "Empty order cannot be placed. Please add some products to place an order"
      );
      return;
    }
    if (uploading) return;
    setUploading(true);
    try {
      const result = await addSubscription(
        cartInfo.retailerId,
        user.distributorId,
        cartItems.filter((item) => validateSubscriptionProduct(item))
      );
      if (!result.error) {
        Alert.alert("Success", `Your subscription has been created`);
        navigation.pop(3);
        navigation.navigate("Orders", { screen: "Orders" });
        navigation.navigate("SubscriptionSuccess");
        setCartItems(cartItems);
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
      setErrors({ ...errors, addSubscription: "Failed to save order" });
    } finally {
      setUploading(false);
    }
  };

  const renderProduct = useCallback(({ item }) => {
    return (
      <SubscribeProduct
        item={item}
        setEditProduct={setEditProduct}
        setSubscriptionProduct={(val) => setSubscriptionProduct(val)}
        showSubscriptionPopup={() => setShowSubscription(true)}
      />
    );
  }, []);
  const productKeyExtractor = useCallback((product) => product.productid, []);

  return (
    <>
      <View style={styles.heading}>
        <View style={styles.flexContainer}>
          <Text variant="titleMedium" style={{ width: "100%" }}>
            <Text style={{ color: "gray" }}>Customer: </Text>
            {cartInfo.retailerName}
          </Text>
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
      </View>
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

      <EditProductPopup
        editProduct={editProduct}
        setEditProduct={setEditProduct}
      />
      <ProductDetail />

      <SubscriptionModal
        showSubscription={showSubscription}
        subscriptionProduct={subscriptionProduct && subscriptionProduct}
        onDismiss={() => setShowSubscription(false)}
      />

      {!showSingleProduct && !showSubscription ? (
        <Button
          onPress={!uploading && handleAddSubscription}
          loading={uploading}
          mode="contained"
          style={styles.orderButton}
        >
          Add Subscription
        </Button>
      ) : null}
    </>
  );
};

export default CreateSubscriptionOrder;

const styles = StyleSheet.create({
  heading: {
    padding: 10,
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
});
