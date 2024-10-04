import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Dimensions } from "react-native";
import { Text, Button } from "react-native-paper";
import {
  saveOrder,
  editOrder,
  calculateCartTotals,
} from "../helpers/salesOrderHelper";
import { useAuthContext } from "../../../contexts/authContext";
import { useCartContext } from "../../../contexts/CartContext";
import CartItem from "./CartItem";
import DatePicker from "../../../component/DatePicker";

const { height } = Dimensions.get("screen");

function Cart({ navigation }) {
  const { user } = useAuthContext();
  const [uploading, setUploading] = useState(false);
  const { cartItems, cartInfo, clearCartContext } = useCartContext();
  const [errors, setErrors] = useState({});
  const [date, setDate] = useState(new Date());

  const totalItems = cartItems
    .filter((item) => item.quantity > 0)
    .reduce((acc, curr) => {
      acc = acc + Number(curr.quantity);
      return acc;
    }, 0);

  const { totalAmount, totalDiscount, totalTax } =
    calculateCartTotals(cartItems);

  useEffect(() => {
    if (cartItems.filter((item) => item.quantity > 0).length == 0) {
      navigation.goBack();
    }
  }, [cartItems]);

  const placeOrder = async () => {
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
      const result = await saveOrder(
        user.distributorId,
        cartItems.filter((item) => item.quantity > 0).length,
        totalAmount,
        "cash",
        totalAmount - totalTax,
        cartItems.filter((item) => item.quantity > 0),
        totalDiscount,
        cartInfo.retailerId,
        date
      );
      if (!result.error) {
        Alert.alert(
          "Success",
          `Your order has been successfully placed with order ID: ${result.data[0]?.orderid}`
        );
        navigation.pop(3);
        navigation.navigate("Orders", { screen: "Orders" });
        clearCartContext();
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
      setErrors({ ...errors, saveOrder: "Failed to save order" });
    } finally {
      setUploading(false);
    }
  };

  const updateOrder = async () => {
    setErrors({ ...errors, saveOrder: "" });
    if (cartItems.length === 0) {
      Alert.alert(
        "Empty cart!",
        "Empty order cannot be placed. Please add some products to update the order or cancel if you no longer wish to fulfill this order"
      );
      return;
    }
    if (uploading) return;
    setUploading(true);
    try {
      const result = await editOrder(
        user.distributorId,
        cartItems.filter((item) => item.quantity > 0).length,
        totalAmount,
        "cash",
        totalAmount - totalTax,
        cartItems.filter((item) => item.quantity > 0),
        totalDiscount,
        cartInfo.orderId,
        cartInfo.retailerId
      );
      if (!result.error) {
        Alert.alert(
          "Success",
          `Your order with ID - ${result.data[0]?.orderid} has been successfully updated!`
        );
        navigation.pop(3);
        navigation.navigate("Orders", { screen: "Orders" });
        clearCartContext();
      } else setErrors({ ...errors, updateOrder: result.error });
    } catch (error) {
      Alert.alert("Error", "There was an error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.toppagecontainer}>
          <View style={styles.flexContainer}>
            <Text variant="titleMedium" style={{ width: "60%" }}>
              <Text style={{ color: "gray" }}>Customer: </Text>
              {cartInfo.retailerName}
            </Text>
            {cartInfo.action == "place" && (
              <View
                style={{
                  alignSelf: "center",
                  borderRadius: 5,
                  borderColor: "gray",
                  borderWidth: 1,
                  marginRight: 10,
                }}
              >
                <DatePicker
                  date={date}
                  setDate={setDate}
                  text={"From"}
                  showFlag={true}
                />
              </View>
            )}
          </View>
          <View style={styles.flexContainer}>
            <Text variant="titleMedium">
              <Text style={{ color: "gray" }}>Items: </Text>
              {totalItems}
            </Text>
            <Text variant="titleMedium" style={{ paddingRight: 10 }}>
              {cartInfo.action === "update" ? `ID: ${cartInfo.orderId}` : null}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <View style={styles.flexContainer}>
              <Text variant="titleMedium">
                <Text style={{ color: "gray" }}>Products: </Text>
                {cartItems.filter((item) => item.quantity > 0).length}
              </Text>
            </View>

            {totalTax !== "0.00" ? (
              <View style={styles.flexContainer}>
                <Text variant="titleMedium" style={{ paddingRight: 10 }}>
                  <Text style={{ color: "gray" }}>Subtotal: </Text>
                  {`\u20B9`}
                  {Number(totalAmount - totalTax).toFixed(2)}
                </Text>
              </View>
            ) : (
              <View style={styles.flexContainer}></View>
            )}
          </View>
          <View
            style={{
              display:
                totalDiscount !== "0.00" || totalTax !== "0.00"
                  ? "flex"
                  : "none",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            {totalDiscount !== "0.00" ? (
              <View style={styles.flexContainer}>
                <Text variant="titleMedium" style={{ paddingRight: 10 }}>
                  <Text style={{ color: "gray" }}>Discounts: </Text>
                  {`\u20B9`}
                  {Number(totalDiscount).toFixed(2)}
                </Text>
              </View>
            ) : (
              <View style={styles.flexContainer}></View>
            )}

            {totalTax !== "0.00" ? (
              <Text variant="titleMedium" style={{ paddingRight: 10 }}>
                <Text style={{ color: "gray" }}>GST: </Text>
                {`\u20B9`}
                {Number(totalTax).toFixed(2)}
              </Text>
            ) : (
              <Text style={{ paddingRight: 10 }}></Text>
            )}
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              borderTopColor: "black",
              borderTopWidth: 1,
            }}
          >
            <View style={styles.flexContainer}>
              <Text variant="titleMedium" style={{ paddingRight: 10 }}>
                <Text style={{ color: "gray" }}>Grand Total: </Text>
              </Text>
            </View>
            <Text variant="titleMedium" style={{ paddingRight: 10 }}>
              {`\u20B9`}
              {Number(totalAmount).toFixed(2)}
            </Text>
          </View>
        </View>
        <ScrollView
          style={{
            marginTop: "1%",
            width: "100%",
            marginBottom: (height * 6) / 100,
          }}
        >
          {cartItems
            .filter((item) => item.quantity > 0)
            .map((item, i) => (
              <CartItem item={item} key={i} />
            ))}
        </ScrollView>
      </View>
      {cartInfo.action === "update" ? (
        <Button
          loading={uploading}
          onPress={!uploading && updateOrder}
          style={styles.orderButton}
          mode="contained"
        >
          Update Order
        </Button>
      ) : (
        <Button
          loading={uploading}
          onPress={!uploading && placeOrder}
          style={styles.orderButton}
          mode="contained"
        >
          Place Order
        </Button>
      )}
    </>
  );
}

export default Cart;

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    height: "100%",
    padding: 10,
  },
  toppagecontainer: {
    backgroundColor: "white",
    width: "100%",
    height: "auto",
    paddingTop: 5,
    paddingBottom: 5,
  },
  flexContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
    marginLeft: 10,
  },
  orderButton: {
    width: "100%",
    paddingVertical: 5,
    position: "absolute",
    bottom: 0,
    borderRadius: 3,
  },
});
