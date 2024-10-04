import React, { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import {
  Button,
  Provider,
  Portal,
  Modal,
  Text,
  TextInput,
} from "react-native-paper";
import { useCartContext } from "../../../contexts/CartContext";

const { height } = Dimensions.get("screen");

function EditProductPopup({ editProduct, setEditProduct }) {
  const [discount, setDiscount] = useState(0);
  const { updateCartItem, cartItems } = useCartContext();

  useEffect(() => {
    if (!editProduct?.productid) return;
    const pDiscount = cartItems?.find(
      (item) => item.productid === editProduct.productid
    )?.discount;
    setDiscount(pDiscount || 0);
  }, [editProduct?.productid]);

  const handleDiscountChange = (val) => {
    if (
      val !== "" &&
      (isNaN(val) || isNaN(parseFloat(val)) || val < 0 || val === " ")
    )
      return;
    setDiscount(Number(val));
    updateCartItem(editProduct.productid, "discount", Number(val), editProduct);
  };
  return (
    <Provider>
      <Portal>
        <Modal
          contentContainerStyle={{
            width: "60%",
            maxHeight: (height * 50) / 100,
            backgroundColor: "white",
            marginLeft: "auto",
            marginRight: "auto",
            display: "flex",
            justifyContent: "center",
            borderRadius: 10,
          }}
          onDismiss={() => setEditProduct(null)}
          visible={editProduct}
        >
          <View style={{ width: "100%", padding: 10, alignSelf: "center" }}>
            <Text variant="titleMedium" style={{ textAlign: "center" }}>
              Add Discount
            </Text>
            <Text
              style={{ paddingTop: 15, fontWeight: "600" }}
              variant="titleSmall"
            >
              Add Discount (%):
            </Text>
            <TextInput
              mode="outlined"
              style={{ width: "100%" }}
              placeholder="0"
              value={discount + ""}
              keyboardType={"number-pad"}
              onChangeText={handleDiscountChange}
            />
            <Button
              mode="contained"
              style={{ marginTop: 20 }}
              onPress={() => setEditProduct(null)}
            >
              Add
            </Button>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
}

export default EditProductPopup;
