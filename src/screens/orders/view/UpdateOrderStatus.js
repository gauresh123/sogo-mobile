import React, { useState, useEffect } from "react";
import { getOrderStatus, editOrderStatus } from "../helpers/ordersHelper";
import { Alert, View, TouchableOpacity, Dimensions, Text } from "react-native";
import { Modal, Portal, Provider, useTheme } from "react-native-paper";

const { height } = Dimensions.get("screen");
const { width } = Dimensions.get("screen");

const containerStyle = {
  backgroundColor: "#eeeeee",
  width: "90%",
  marginLeft: "6%",
  display: "flex",
  justifyContent: "center",
  borderRadius: 10,
};

function UpdateOrderStatus({ value, hideModal, visible, fetchOrders }) {
  const [orderStatusIdMap, setOrderStatusIdMap] = useState([]);

  const theme = useTheme();
  useEffect(() => {
    fetchOrderStatus();
  }, []);

  const fetchOrderStatus = async () => {
    try {
      const response = await getOrderStatus();
      setOrderStatusIdMap(response.data);
    } catch (error) {
      Alert.alert("", "There was an error");
    }
  };

  const updateOrderStatus = async (newStatus) => {
    const statusId = orderStatusIdMap.find(
      (status) => status.orderstatus === newStatus
    ).orderstatusid;
    try {
      const response = await editOrderStatus(
        value.orderid,
        statusId,
        newStatus
      );
      if (response.data) {
        fetchOrders();
      } else {
        Alert.alert("Error", response.error);
      }
    } catch (error) {
      Alert.alert("Error", "There was an error");
    } finally {
      hideModal();
    }
  };

  return (
    <Provider>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          animationType="slide"
          contentContainerStyle={containerStyle}
        >
          <View
            style={{
              padding: "3%",
              backgroundColor: theme.colors.secondaryContainer,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontWeight: "600",
                fontSize: (height * 1.8) / 100,
                color: "black",
              }}
            >
              Select Status
            </Text>
          </View>

          <View style={{ marginLeft: (width * 4) / 100 }}>
            {orderStatusIdMap.map((val, i) => {
              return (
                <TouchableOpacity
                  onPress={() => updateOrderStatus(val.orderstatus)}
                  style={{
                    paddingBottom: (height * 2) / 100,
                    paddingTop: (height * 2) / 100,
                  }}
                  key={i}
                >
                  <Text
                    variant="titleMedium"
                    style={{
                      fontSize: (height * 1.7) / 100,
                      fontWeight: "500",
                      color: "black",
                    }}
                  >
                    {val.orderstatus}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
}

export default UpdateOrderStatus;
