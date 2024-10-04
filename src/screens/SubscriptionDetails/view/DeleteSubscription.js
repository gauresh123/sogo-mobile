import React from "react";
import { Modal, Portal, Provider, Text } from "react-native-paper";
import { View, TouchableOpacity, Dimensions, Alert } from "react-native";
import { useAuthContext } from "../../../contexts/authContext";
import { validateSubscriptionProduct } from "../../SalesOrder/helpers/salesOrderHelper";
import { updateSubscription } from "../helper/subscriptionDetailsHelper";

const { height, width } = Dimensions.get("screen");

const cancelStatusContainer = {
  backgroundColor: "#fafafa",
  width: "90%",
  marginLeft: "6%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "8%",
};

function DeleteSubscription({
  subscriptionProduct,
  onDismiss,
  retailerid,
  getSubscriptionDetailList,
  subscriptionDetail,
}) {
  const { user } = useAuthContext();

  const handleDelete = async () => {
    const updatedData = subscriptionDetail
      .filter(
        (item) => item.subscriptionid !== subscriptionProduct.subscriptionid
      )
      .map((item) => {
        const updatedItem = {
          customWeekdays: item.customweekdays,
          interval: item.interval,
          startDate: item.startdate,
          quantity: item.quantity,
          discount: item.discount,
          price: item.productprice,
          gstrate: 0,
          productname: item.productname,
          manufacturer: null,
          productid: item.productid,
          subscriptionLength: item.subscriptionlength,
        };
        return updatedItem;
      });
    try {
      const result = await updateSubscription(
        retailerid,
        user.distributorId,
        updatedData.filter((val) => validateSubscriptionProduct(val))
      );
      if (!result.error) {
        Alert.alert("Success", `Your subscription has been deleted`);
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      getSubscriptionDetailList();
      onDismiss();
    }
  };
  return (
    <Provider>
      <Portal>
        <Modal
          visible={subscriptionProduct != null}
          onDismiss={onDismiss}
          contentContainerStyle={cancelStatusContainer}
        >
          <View>
            <Text style={{ color: "black" }} variant="titleSmall">
              Do you want to delete the subscription ?
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                marginTop: (height * 3) / 100,
              }}
            >
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <Text
                  variant="titleSmall"
                  style={{
                    textAlign: "center",
                    marginRight: (width * 12) / 100,
                    color: "red",
                    fontSize: (height * 1.9) / 100,
                  }}
                  onPress={handleDelete}
                >
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onDismiss}>
                <Text variant="titleSmall" style={{ color: "black" }}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
}

export default DeleteSubscription;
