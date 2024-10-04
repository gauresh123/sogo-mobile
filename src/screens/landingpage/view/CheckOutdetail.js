import React, { useState } from "react";
import {
  Modal,
  Portal,
  Provider,
  Text,
  TextInput,
  Button,
  HelperText,
  Checkbox,
  useTheme,
} from "react-native-paper";
import {
  View,
  Dimensions,
  Alert,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useAuthContext } from "../../../contexts/authContext";
import { addSaleCheckin, getLocation } from "../helpers/landingPageHelper";
import { MaterialIcons } from "@expo/vector-icons";
import { reasons } from "../../../constants/CheckInReasons";

const { height } = Dimensions.get("screen");

const CheckOutdetail = ({ visible, onDismiss, retailerId }) => {
  const { user } = useAuthContext();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const clearState = () => {
    setOrderPlaced(false);
    setError("");
  };

  const validateInput = () => {
    let temp = {};
    if (!orderPlaced && !reason)
      temp.reason = "Reason is required when order not placed";
    setError(temp);
    return !Object.values(temp).filter((val) => val != "")?.length > 0;
  };

  const submitHandlePressed = async () => {
    if (!validateInput()) return;

    try {
      if (isLoading) return;
      setIsLoading(true);
      const location = await getLocation(35000);

      if (!location) {
        Alert.alert("", "Failed to get location");
        return;
      }

      const res = await addSaleCheckin(
        user.distributorId,
        retailerId,
        location,
        orderPlaced,
        reason,
        comment,
        user.userId
      );

      if (!res.error) {
        Alert.alert("Success", "You have checked in successfully.");
        onDismiss();
        clearState();
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const reasonHandlePressed = (value) => {
    setReason(value);
    if (value) {
      setShowDropdown(false);
    }
  };
  return (
    <Provider>
      <Portal>
        <Modal
          visible={visible}
          contentContainerStyle={{
            width: "100%",
            maxHeight: (height * 80) / 100,
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            borderRadius: 10,
          }}
          onDismiss={!isLoading && (() => onDismiss())}
        >
          <ScrollView>
            <View
              style={{
                padding: "2%",
                backgroundColor: theme.colors.secondaryContainer,
                borderRadius: 10,
                fontWeight: 600,
                marginBottom: 10,
                justifyContent: "center",
              }}
            >
              <Text variant="titleMedium" style={{ color: "black" }}>
                Check-In
              </Text>
            </View>
            <View
              style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 20 }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  variant="titleMedium"
                  style={{ fontWeight: "600", color: "black" }}
                >
                  Order placed :
                </Text>
                <Checkbox
                  status={orderPlaced ? "checked" : "unchecked"}
                  onPress={() => {
                    setOrderPlaced((prev) => !prev);
                  }}
                />
              </View>

              {!orderPlaced && (
                <View
                  style={{
                    marginTop: (height * 1) / 100,
                    marginBottom: (height * 1) / 100,
                  }}
                >
                  <Text
                    variant="titleMedium"
                    style={{ fontWeight: "600", color: "black" }}
                  >
                    Reason:
                  </Text>

                  <TouchableOpacity
                    onPress={() => setShowDropdown(!showDropdown)}
                  >
                    <TextInput
                      placeholder={reason || "Select Reason"}
                      placeholderTextColor={"black"}
                      style={{
                        elevation: 1,
                        backgroundColor: "white",
                      }}
                      mode="outlined"
                      multiline={true}
                      editable={false}
                      right={
                        <TextInput.Icon
                          icon={() => (
                            <MaterialIcons
                              name="arrow-drop-down"
                              size={23}
                              color="gray"
                              onPress={() => setShowDropdown(!showDropdown)}
                            />
                          )}
                        />
                      }
                    />
                  </TouchableOpacity>
                  {showDropdown && (
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: "gray",
                        borderRadius: 10,
                      }}
                    >
                      {reasons.map((val) => {
                        return (
                          <TouchableOpacity
                            key={val.id}
                            style={{ padding: 10 }}
                            onPress={() => reasonHandlePressed(val.value)}
                          >
                            <Text
                              variant="bodyMedium"
                              style={{ color: "black" }}
                            >
                              {val.value}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}
              {error.reason && !orderPlaced && !reason && (
                <HelperText visible={error.reason} type={"error"}>
                  {error.reason}
                </HelperText>
              )}

              <View
                style={{
                  marginTop: (height * 1) / 100,
                  marginBottom: (height * 1) / 100,
                }}
              >
                <Text
                  variant="titleMedium"
                  style={{ fontWeight: "600", color: "black" }}
                >
                  Comment:
                </Text>
                <TextInput
                  style={{
                    elevation: 1,
                    backgroundColor: "white",
                  }}
                  theme={{
                    colors: {
                      onSurface: "black",
                    },
                  }}
                  mode="outlined"
                  multiline={true}
                  onChangeText={(val) => setComment(val)}
                />
              </View>

              <Button
                mode="contained"
                loading={isLoading}
                style={{
                  marginTop: (height * 1) / 100,
                  backgroundColor: "#674fa3",
                }}
                onPress={submitHandlePressed}
                textColor="white"
              >
                Submit
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </Provider>
  );
};

export default CheckOutdetail;
