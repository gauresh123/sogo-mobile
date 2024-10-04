import React from "react";
import {
  Text,
  Provider,
  Portal,
  Modal,
  Button,
  useTheme,
} from "react-native-paper";
import { Dimensions, Image, View } from "react-native";
import { useCartContext } from "../../../contexts/CartContext";
import { DEFAULT_PRODUCT_IMAGE } from "../../../constants/constants";

const { height, width } = Dimensions.get("screen");

const ProductDetail = () => {
  const { showSingleProduct, setShowSingleProduct, singleProduct } =
    useCartContext();
  const theme = useTheme();

  return (
    <Provider>
      <Portal>
        <Modal
          visible={showSingleProduct}
          onDismiss={() => setShowSingleProduct(false)}
          contentContainerStyle={{
            maxHeight: (height * 90) / 100,
            width: "100%",
            position: "absolute",
            bottom: 0,
            backgroundColor: "white",
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }}
        >
          <View>
            <View
              style={{
                padding: "2%",
                backgroundColor: theme.colors.secondaryContainer,
                borderRadius: 10,
                fontWeight: 600,
                marginBottom: (height * 3) / 100,
                justifyContent: "center",
              }}
            >
              <Text
                variant="titleMedium"
                style={{ textAlign: "center", color: "black" }}
              >
                {singleProduct.productname}
              </Text>
            </View>

            <Image
              source={{ uri: singleProduct.image || DEFAULT_PRODUCT_IMAGE }}
              style={{
                width: (width * 90) / 100,
                height: (height * 30) / 100,
                marginLeft: (width * 5) / 100,
              }}
            />
            {/*
            <Text
              style={{ paddingLeft: (width * 5) / 100, marginTop: 10 }}
              variant="titleSmall"
            >
              {singleProduct.productname}
            </Text>*/}
            <Button
              style={{
                marginTop: (height * 3) / 100,
                marginLeft: (width * 5) / 100,
                marginRight: (width * 5) / 100,
                marginBottom: (height * 3) / 100,
              }}
              mode="contained"
              onPress={() => setShowSingleProduct(false)}
              textColor="white"
            >
              Close
            </Button>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
};

export default ProductDetail;
