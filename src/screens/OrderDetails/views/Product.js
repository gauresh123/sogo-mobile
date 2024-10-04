import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { getDiscountedTaxedPrice } from "../../SalesOrder/helpers/salesOrderHelper";

function Product({ item }) {
  const theme = useTheme();
  const productPrice = getDiscountedTaxedPrice(item, item);
  return (
    <View
      style={{
        ...styles.product,
        borderBottomColor: "silver",
        paddingBottom: "3%",
        backgroundColor: "#fafafa",
      }}
    >
      <View style={{ width: "70%" }}>
        <Text variant="titleMedium">{item.productname}</Text>
        <Text style={styles.price} variant="titleSmall">
          Price : {`\u20B9`} {productPrice}
        </Text>
        <Text>
          Amount : {`\u20B9`} {Number(productPrice * item.quantity).toFixed(2)}
        </Text>
      </View>
      <View style={styles.unitSection}>
        <Text>Qty : </Text>
        <View
          style={{
            width: 70,
            height: 40,
            backgroundColor: theme.colors.secondaryContainer,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
          }}
        >
          <Text variant="titleSmall">{item.productquantity}</Text>
        </View>
      </View>
    </View>
  );
}

export default Product;

const styles = StyleSheet.create({
  product: {
    margin: 5,
    padding: 5,
    paddingTop: 0,
    display: "flex",
    flexDirection: "row",
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  price: {
    color: "gray",
  },
  unitSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
});
