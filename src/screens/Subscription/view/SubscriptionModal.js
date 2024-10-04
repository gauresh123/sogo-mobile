import React, { useEffect, useState } from "react";
import {
  Text,
  Provider,
  Portal,
  Modal,
  Button,
  useTheme,
  TextInput,
  HelperText,
} from "react-native-paper";
import { Dimensions, ScrollView, TouchableOpacity, View } from "react-native";
import DatePicker from "../../../component/DatePicker";
import { useCartContext } from "../../../contexts/CartContext";

const { height } = Dimensions.get("screen");
const SUBSCRIPTION_TYPES = ["Daily", "Alternate", "Custom"];

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const SubscriptionModal = ({
  subscriptionProduct,
  onDismiss,
  showSubscription,
}) => {
  const theme = useTheme();
  const { updateCartItem, cartItems } = useCartContext();

  const product =
    cartItems.find(
      (item) => item.productid == subscriptionProduct?.productid
    ) || {};
  const { interval, subscriptionLength, customWeekdays, startDate } = product;

  const [error, setError] = useState("");

  const daysPressed = (day) => {
    setError("");
    let newDays = product.customWeekdays || new Array();
    if (product?.customWeekdays?.includes(day)) {
      newDays = newDays.filter((val) => val !== day);
    } else {
      newDays = [...newDays, day];
    }
    updateCartItem(
      subscriptionProduct?.productid,
      "customWeekdays",
      newDays,
      subscriptionProduct
    );
  };

  const handleIntervalChange = (value) => {
    updateCartItem(
      subscriptionProduct?.productid,
      "interval",
      value,
      subscriptionProduct
    );
  };

  const handleStartDateChange = (value) => {
    updateCartItem(
      subscriptionProduct?.productid,
      "startDate",
      value,
      subscriptionProduct
    );
  };

  const handleSubscriptionLengthChange = (value) => {
    if (value.includes("-") || value.includes(".") || value.includes(","))
      return;
    if (
      value == "" ||
      (Number.isInteger(parseInt(value)) && parseInt(value) > 0)
    ) {
      updateCartItem(
        subscriptionProduct?.productid,
        "subscriptionLength",
        value,
        subscriptionProduct
      );
    } else return;
  };

  // set default values if new product
  useEffect(() => {
    if (!subscriptionProduct) return;
    if (!subscriptionProduct?.interval) {
      updateCartItem(
        subscriptionProduct?.productid,
        "interval",
        interval || "daily",
        subscriptionProduct
      );
    }
    if (!subscriptionProduct?.startDate) {
      updateCartItem(
        subscriptionProduct?.productid,
        "startDate",
        startDate || new Date(),
        subscriptionProduct
      );
    }
    if (!subscriptionProduct?.subscriptionLength) {
      updateCartItem(
        subscriptionProduct?.productid,
        "subscriptionLength",
        subscriptionLength || "1",
        subscriptionProduct
      );
    }
  }, [subscriptionProduct?.productid]);

  const dismissPressed = () => {
    if (!product) return;
    if (
      !product.interval ||
      !product.startDate ||
      !product.subscriptionLength
    ) {
      return;
    }
    if (
      interval?.toLowerCase() === "custom" &&
      !product.customWeekdays?.length
    ) {
      setError("Custom days are required for custom subscriptions");
      return;
    }
    onDismiss();
  };

  return (
    <Provider>
      <Portal>
        <Modal
          visible={showSubscription}
          onDismiss={onDismiss}
          contentContainerStyle={{
            maxHeight: (height * 60) / 100,
            width: "100%",
            position: "absolute",
            bottom: 0,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            backgroundColor: "white",
          }}
        >
          <ScrollView>
            <View
              style={{
                padding: "2%",
                backgroundColor: theme.colors.secondaryContainer,
                borderRadius: 10,
                fontWeight: 600,
                marginBottom: (height * 1) / 100,
                justifyContent: "center",
              }}
            >
              <Text
                variant="titleMedium"
                style={{
                  textAlign: "center",
                  color: "black",
                }}
              >
                Select Subscription
              </Text>
            </View>
            <View style={{ padding: 10 }}>
              <Text
                style={{
                  marginBottom: (height * 1) / 100,
                  fontWeight: "600",
                  color: "black",
                }}
                variant="titleMedium"
              >
                Select your subscription type
              </Text>
              <View style={{ display: "flex", flexDirection: "row" }}>
                {SUBSCRIPTION_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      marginRight: 10,
                      borderWidth: 1,
                      borderColor: "gray",
                      borderRadius: 8,
                      backgroundColor:
                        interval === type.toLowerCase()
                          ? theme.colors.primaryContainer
                          : "white",
                    }}
                    onPress={() => handleIntervalChange(type.toLowerCase())}
                  >
                    <Text style={{ color: "black" }}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {interval && (
                <>
                  <Text
                    variant="titleMedium"
                    style={{
                      fontWeight: "600",
                      marginTop: (height * 1) / 100,
                      color: "black",
                    }}
                  >
                    Select start date:
                  </Text>
                  <View
                    style={{
                      marginTop: (height * 1) / 100,
                      borderWidth: 1,
                      borderColor: "gray",
                      width: 200,
                      borderRadius: 5,
                    }}
                  >
                    <DatePicker
                      date={startDate}
                      setDate={handleStartDateChange}
                      dateFormat={"do MMM yyy"}
                      text={"From"}
                      showFlag={true}
                    />
                  </View>

                  <Text
                    variant="titleMedium"
                    style={{
                      fontWeight: "600",
                      marginTop: (height * 1) / 100,
                      color: "black",
                    }}
                  >
                    Select days:
                  </Text>

                  <TextInput
                    style={{
                      marginTop: (height * 1) / 100,
                      width: 150,
                      color: "black",
                      backgroundColor: "white",
                    }}
                    theme={{
                      colors: {
                        onSurface: "black",
                      },
                    }}
                    keyboardType="numeric"
                    mode="outlined"
                    placeholder="Add days"
                    value={subscriptionLength}
                    onChangeText={handleSubscriptionLengthChange}
                  />
                </>
              )}
              <>
                {interval == "custom" && (
                  <Text
                    variant="titleMedium"
                    style={{
                      fontWeight: "600",
                      marginTop: (height * 1) / 100,
                      color: "black",
                    }}
                  >
                    Select custom days:
                  </Text>
                )}
                {interval == "custom" && subscriptionLength && (
                  <>
                    <ScrollView
                      horizontal
                      style={{ marginTop: (height * 1) / 100 }}
                    >
                      {weekdays.map((day) => {
                        const isSelected = customWeekdays?.includes(day);
                        return (
                          <TouchableOpacity
                            key={day}
                            style={{
                              paddingHorizontal: 10,
                              paddingVertical: 5,
                              marginRight: 15,
                              borderWidth: 1,
                              borderColor: "gray",
                              borderRadius: 8,
                              backgroundColor: isSelected
                                ? theme.colors.primaryContainer
                                : null,
                            }}
                            onPress={() => daysPressed(day)}
                          >
                            <Text style={{ color: "black" }}>
                              {day.substring(0, 3)}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                    <HelperText visible={error} type="error">
                      {error}
                    </HelperText>
                  </>
                )}
              </>
              <Button
                mode="contained"
                style={{
                  marginTop: (height * 1) / 100,
                  marginBottom: (height * 1) / 100,
                }}
                textColor="white"
                onPress={dismissPressed}
              >
                {interval ? "Subscribe" : "Close"}
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </Provider>
  );
};

export default SubscriptionModal;
