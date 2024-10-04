import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useTheme, Text } from "react-native-paper";
import { useCartContext } from "../../../contexts/CartContext";
import { getDiscountedTaxedPrice } from "../helpers/salesOrderHelper";

function CartItem({ item }) {
  const theme = useTheme();
  const { setCartItems } = useCartContext();

  const deleteHandlePress = (item) => {
    setCartItems((prev) =>
      prev.filter((val) => item.productid !== val.productid)
    );
  };

  return (
    <View style={styles.productcontainer}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{ marginLeft: 10, marginTop: 10, width: "85%" }}
          variant="titleMedium"
        >
          {item.productname}
        </Text>
        <TouchableOpacity
          style={{ alignSelf: "center", marginRight: 10 }}
          onPress={() => deleteHandlePress(item)}
        >
          <AntDesign name="delete" size={20} />
        </TouchableOpacity>
      </View>
      <Text
        style={{
          marginLeft: 10,
          marginTop: 10,
          color: "#424242",
          width: "85%",
        }}
        variant="titleSmall"
      >
        Price : {`\u20B9`}
        {getDiscountedTaxedPrice(item, item)}
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ marginLeft: 10, marginTop: 10 }} variant="titleSmall">
          Amount : {`\u20B9`}
          {Number(getDiscountedTaxedPrice(item, item) * item.quantity).toFixed(
            2
          )}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: 10,
            justifyContent: "flex-end",
            alignItems: "flex-end",
            marginRight: 10,
            marginBottom: 10,
          }}
        >
          <Text>Qty : </Text>
          <View
            style={{
              width: "40%",
              height: 35,
              justifyContent: "center",
              backgroundColor: theme.colors.primaryContainer,
              alignItems: "center",
              borderRadius: 15,
            }}
          >
            <Text>{item.quantity}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default CartItem;

const styles = StyleSheet.create({
  productcontainer: {
    width: "100%",
    backgroundColor: "#fafafa",
    height: "auto",
    marginBottom: "2%",
    marginTop: "3%",
    shadowColor: "#000",
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});
