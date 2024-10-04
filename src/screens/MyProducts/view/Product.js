import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Text } from "react-native-paper";
import { DEFAULT_PRODUCT_IMAGE } from "../../../constants/constants";

const { height, width } = Dimensions.get("screen");

function Product({ item, productPress }) {
  
  return (
    <TouchableOpacity
      style={{
        ...styles.product,
      }}
      onPress={() => productPress(item)}
    >
      <View
        style={{
          maxWidth: "65%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Image
          source={{
            uri: item.image || DEFAULT_PRODUCT_IMAGE,
          }}
          style={{
            width: (width * 15) / 100,
            height: (height * 10) / 100,
            alignSelf: "center",
            marginRight: (width * 1.5) / 100,
          }}
        />
        <View style={{ width: "100%" }}>
          <Text variant="titleMedium">{item.productname}</Text>
          <Text style={styles.pricecontainer}>
            <Text style={styles.price} variant="titleSmall">
              Price:
            </Text>
            <Text variant="titleSmall">
              {" "}
              {`\u20B9`}
              {Number(item.price).toFixed(2)}
            </Text>
          </Text>
          <Text style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <Text style={styles.pricecontainer}>
              <Text variant="titleSmall" style={styles.price}>
                MRP:{" "}
              </Text>
              <Text variant="titleSmall">
                {`\u20B9`}
                {item.mrp}
              </Text>
            </Text>
            <Text style={styles.pricecontainer}>
              <Text style={styles.price} variant="titleSmall">
                {" "}
                Margin:{" "}
              </Text>
              <Text variant="titleSmall">
                {Number(((item.mrp - item.price) / item.price) * 100).toFixed(
                  1
                )}
                %
              </Text>
            </Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default Product;

const styles = StyleSheet.create({
  product: {
    paddingLeft: 10,
    display: "flex",
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    marginBottom: (height * 2) / 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    borderBottomColor: "silver",
    backgroundColor: "#fafafa",
    paddingTop: (height * 1) / 100,
    paddingBottom: (height * 1) / 100,

    elevation: 4,
    backgroundColor: "#fafafa",
    borderRadius: 10,
  },
  price: {
    color: "gray",
  },
  pricecontainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
});
