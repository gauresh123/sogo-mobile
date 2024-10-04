import React from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { Text, Provider, Portal, Modal, Button } from "react-native-paper";
import useAddress from "../../../hooks/useAddress";
import LoadingContainer from "./../../../component/LoadingContainer";
import { useNavigation } from "@react-navigation/native";

const { height } = Dimensions.get("screen");

const OutletAddress = ({
  visible,
  onDismiss,
  userId,
  retailerName,
  mobileno,
}) => {
  const {
    address,
    address: { street1, street2, city, landmark, district, state, zipcode },
    loading,
    error,
  } = useAddress(userId);
  const navigation = useNavigation();

  const editAddressPressed = () => {
    navigation.navigate("EditOutletAddress", {
      address,
      userId,
    });
    onDismiss();
  };
  return (
    <Provider>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={onDismiss}
          contentContainerStyle={{
            maxHeight: (height * 80) / 100,
            width: "100%",
            position: "absolute",
            bottom: 0,
            backgroundColor: "white",
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }}
        >
          <ScrollView
            style={{
              paddingTop: (height * 1.5) / 100,
              paddingBottom: (height * 1.5) / 100,
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <View style={{ display: "flex", flexDirection: "row" }}>
              <Text variant="titleMedium" style={{ color: "black" }}>
                Customer :{" "}
              </Text>
              <Text
                variant="bodyLarge"
                style={{
                  width: "75%",
                  textAlignVertical: "center",
                  color: "black",
                }}
              >
                {retailerName}
              </Text>
            </View>
            <LoadingContainer
              loading={loading}
              style={{
                minHeight: 140,
              }}
            >
              <View
                style={{
                  display: street1 || street2 ? "flex" : "none",
                  flexDirection: "row",
                  marginTop: (height * 1.5) / 100,
                }}
              >
                <Text variant="titleMedium" style={{ color: "black" }}>
                  Address :{" "}
                </Text>
                <Text
                  variant="bodyLarge"
                  style={{
                    width: "70%",
                    textAlignVertical: "center",
                    color: "black",
                  }}
                >
                  {street1}
                </Text>
              </View>

              <View
                style={{
                  display: street2 ? "flex" : "none",
                  flexDirection: "row",
                  marginTop: (height * 0.5) / 100,
                }}
              >
                <Text variant="titleMedium">{"                  "}</Text>
                <Text
                  variant="bodyLarge"
                  style={{
                    width: "70%",
                    textAlignVertical: "center",
                    color: "black",
                  }}
                >
                  {street2}
                </Text>
              </View>

              <View
                style={{
                  display: landmark ? "flex" : "none",
                  flexDirection: "row",
                  marginTop: (height * 0.5) / 100,
                }}
              >
                <Text variant="titleMedium">{"                  "}</Text>
                <Text
                  variant="bodyLarge"
                  style={{
                    width: "70%",
                    textAlignVertical: "center",
                    color: "black",
                  }}
                >
                  {landmark}
                </Text>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop:
                    street1 || street2 || landmark
                      ? (height * 0.5) / 100
                      : (height * 1.5) / 100,
                }}
              >
                <Text variant="titleMedium" style={{ color: "black" }}>
                  {street1 || street2 || landmark
                    ? "                  "
                    : "City : "}
                </Text>
                <Text
                  variant="bodyLarge"
                  style={{
                    width: "70%",
                    textAlignVertical: "center",
                    color: "black",
                  }}
                >
                  {city && `${city}`}
                  {state && `, ${state}`}
                  {zipcode && `, ${zipcode}`}
                </Text>
              </View>

              {mobileno && (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: (height * 1.5) / 100,
                  }}
                >
                  <Text variant="titleMedium" style={{ color: "black" }}>
                    Phone Number :{" "}
                  </Text>
                  <Text
                    variant="bodyLarge"
                    style={{
                      width: "70%",
                      textAlignVertical: "center",
                      color: "black",
                    }}
                  >
                    {mobileno}
                  </Text>
                </View>
              )}
            </LoadingContainer>
            <Button
              mode="contained"
              style={{
                width: "100%",
                marginTop: (height * 1.5) / 100,
                backgroundColor: "#674fa3",
              }}
              onPress={editAddressPressed}
              textColor="white"
            >
              Edit address
            </Button>
          </ScrollView>
        </Modal>
      </Portal>
    </Provider>
  );
};

export default OutletAddress;
