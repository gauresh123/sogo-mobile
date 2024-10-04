import React, { useState } from "react";
import {
  Button,
  Modal,
  Portal,
  Provider,
  Text,
  useTheme,
} from "react-native-paper";
import { View, TouchableOpacity, Dimensions, Alert } from "react-native";
import { editOrderPaymentStatus } from "../helpers/ordersHelper";

const { height } = Dimensions.get("screen");

const PaymentStatusPopup = ({ shown, onDismiss, item, fetchOrders }) => {
  const [isLoading, setIsLoading] = useState(false);

  const paymentConfirm = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    await editOrderPaymentStatus(item.orderid, !item.ispaid)
      .then((res) => {
        if (res.data) {
          fetchOrders();
        }
      })
      .catch((res) => {
        Alert.alert("Error", res.message);
      })
      .finally(() => {
        setIsLoading(false);
        onDismiss();
      });
  };
  const theme = useTheme();
  return (
    <Provider>
      <Portal>
        <Modal
          visible={shown}
          onDismiss={onDismiss}
          contentContainerStyle={{
            backgroundColor: "#fafafa",
            width: "90%",
            marginLeft: "5%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "8%",
            borderRadius: 10,
          }}
        >
          <View>
            <Text style={{ fontWeight: "500", color: "black" }}>
              Do you want to change the payment status?
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: (height * 3) / 100,
              }}
            >
              <TouchableOpacity onPress={paymentConfirm}>
                <Button
                  style={{ width: 120, backgroundColor: "#674fa3" }}
                  mode="contained"
                  loading={isLoading}
                  textColor="white"
                >
                  Yes
                </Button>
              </TouchableOpacity>
              <TouchableOpacity onPress={onDismiss}>
                <Button
                  style={{
                    width: 120,
                    borderColor: "#674fa3",
                  }}
                  mode="outlined"
                  textColor="#674fa3"
                >
                  No
                </Button>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
};

export default PaymentStatusPopup;
