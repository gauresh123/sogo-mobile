import React, { useCallback } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text, TextInput } from "react-native-paper";
import { DEFAULT_PRODUCT_IMAGE } from "../../../constants/constants";
import { useCartContext } from "../../../contexts/CartContext";
import { AntDesign } from "@expo/vector-icons";
import { getDiscountedTaxedPrice } from "../helpers/salesOrderHelper";
import { useAuthContext } from "../../../contexts/authContext";
import HARD_CODED_USER_IDS from "../../../constants/edgeCaseUsers";
import { validatePriceFormat } from "../../MyProducts/view/NewProduct";
const { height, width } = Dimensions.get("screen");

function Product({ item, setEditProduct }) {
  const { user } = useAuthContext();
  const { cartItems, setCartItems, setShowSingleProduct, setSingleProduct } =
    useCartContext();

  const cartItem = cartItems?.find(
    (product) => product.productid === item.productid
  );

  const productQuantity = cartItem ? cartItem.quantity : 0;
  const productPrice = getDiscountedTaxedPrice(item, cartItem);

  const updateQuantity = useCallback((amount, item) => {
    setCartItems((prev) => {
      let obj = [...prev];
      const index = obj?.findIndex(
        (cItem) => cItem.productid === item.productid
      );
      if (index > -1) {
        obj[index].quantity = amount || 0;
      } else {
        obj.push({
          discount: item.discount || 0,
          price: item.price,
          gstrate: item.gstrate,
          productid: item.productid,
          productname: item.productname,
          manufacturer: item.manufacturer || null,
          quantity: amount || 0,
        });
      }
      return obj;
    });
  }, []);

  const imageHandlepress = () => {
    setShowSingleProduct(true);
    setSingleProduct(item);
  };

  return (
    <View
      style={{
        ...styles.product,
        borderBottomColor: "silver",
        paddingBottom: "3%",
        backgroundColor: "#fafafa",
      }}
    >
      <View
        style={{
          maxWidth: "65%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{
            width: (width * 15) / 100,
            height: (height * 10) / 100,
            alignSelf: "center",
            marginRight: (width * 1.5) / 100,
          }}
          onPress={imageHandlepress}
        >
          <Image
            source={{
              uri: item.image || DEFAULT_PRODUCT_IMAGE,
            }}
            style={{
              width: (width * 15) / 100,
              height: (height * 10) / 100,
              alignSelf: "center",
            }}
          />
        </TouchableOpacity>
        <View style={{ width: "100%" }}>
          <Text variant="titleMedium">{item.productname}</Text>
          <Text style={styles.pricecontainer}>
            <Text style={styles.price} variant="titleSmall">
              Price:
            </Text>
            <Text variant="titleSmall">
              {" "}
              {`\u20B9`}
              {productPrice}
            </Text>
            {!HARD_CODED_USER_IDS.includes(user.distributorId) && (
              <Text onPress={() => setEditProduct(item)}>
                <AntDesign name="edit" size={17} />
              </Text>
            )}
          </Text>
          {!HARD_CODED_USER_IDS.includes(user.distributorId) && (
            <Text
              style={{ display: "flex", flexDirection: "row", width: "80%" }}
            >
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
                  {Number(
                    ((item.mrp - getDiscountedTaxedPrice(item, cartItem)) /
                      getDiscountedTaxedPrice(item, cartItem)) *
                      100
                  ).toFixed(1)}
                  %
                </Text>
              </Text>
            </Text>
          )}

          <Text style={{ display: "flex", flexDirection: "row", width: "80%" }}>
            <Text style={styles.price} variant="titleSmall">
              Amount:
            </Text>{" "}
            <Text variant="titleSmall">
              {`\u20B9`}
              {(productPrice * productQuantity).toFixed(2)}
            </Text>
          </Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <View style={styles.unitSection}>
          <Text variant="labelLarge">Qty: </Text>
          <TextInput
            keyboardType="number-pad"
            style={styles.unitInput}
            variant="flat"
            value={productQuantity === 0 ? "" : productQuantity}
            onChangeText={(text) => {
              if (text.includes("-")) return;
              if (!validatePriceFormat(text)) {
                return;
              }
              updateQuantity(text, item);
            }}
          />
        </View>
      </View>
    </View>
  );
}

const MemoizedProduct = React.memo(Product);
export default MemoizedProduct;

const styles = StyleSheet.create({
  product: {
    marginHorizontal: 5,
    padding: 5,
    display: "flex",
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  price: {
    color: "gray",
  },
  pricecontainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  unitSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  unitInput: {
    width: 60,
    height: 40,
    textAlign: "center",
    paddingHorizontal: 1,
    paddingBottom: 1,
  },
});
