import React, { useState } from "react";
import { Button, Modal, Portal, Provider, Text } from "react-native-paper";
import { View, TouchableOpacity, Dimensions, Alert } from "react-native";
import { mapRetailerByMobile } from "../helper/addRetailerHelper";
import { useAuthContext } from "../../../contexts/authContext";

const { height } = Dimensions.get("screen");

const MapExistingUserPopup = ({ shown, onDismiss, mobileNo }) => {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleMapRetailer = async () => {
    if (isLoading) {
      return;
    }
    try {
      setIsLoading(true);
      const { data, error } = await mapRetailerByMobile(
        mobileNo,
        user.distributorId
      );
      if (error) {
        throw new Error(error);
      } else {
        onDismiss();
        Alert.alert(
          "Success",
          `Customer has been added. User: ${data.retailername}`
        );
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };
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
              User already exists. Do you want to add user as a customer?
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: (height * 3) / 100,
              }}
            >
              <TouchableOpacity onPress={handleMapRetailer}>
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

export default MapExistingUserPopup;
