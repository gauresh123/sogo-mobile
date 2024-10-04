import React, { useState } from "react";
import {
  Text,
  Button,
  useTheme,
  TextInput,
  HelperText,
} from "react-native-paper";
import {
  Alert,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import DatePicker from "../../../component/DatePicker";
import { validateSubscriptionProduct } from "../../SalesOrder/helpers/salesOrderHelper";
import { useAuthContext } from "../../../contexts/authContext";
import { validatePriceFormat } from "../../MyProducts/view/NewProduct";
import { updateSubscription } from "../helper/subscriptionDetailsHelper";

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

const EditSubscriptionModal = ({
  subscriptionProduct,
  retailerid,
  subscriptionDetail,
  getSubscriptionDetailList,
  onDismiss,
}) => {
  const theme = useTheme();
  const { user } = useAuthContext();
  const [error, setError] = useState("");
  const [interval, setInterval] = useState(subscriptionProduct.interval);
  const [fromDate, setFromDate] = useState(
    new Date(subscriptionProduct.startdate || new Date())
  );
  const [subscriptionLength, setSubscriptionLength] = useState(
    subscriptionProduct.subscriptionlength
  );
  const [selectedDays, setSelectedDays] = useState(
    subscriptionProduct.customweekdays || []
  );
  const [qty, setQty] = useState(subscriptionProduct.quantity);
  const [uploading, setUploading] = useState(false);

  const daysPressed = (day) => {
    setError("");
    if (selectedDays.includes(day)) {
      setSelectedDays((prev) => prev.filter((val) => val !== day));
    } else {
      setSelectedDays((prev) => [...prev, day]);
    }
  };

  const handleIntervalChange = (value) => {
    setInterval(value);
  };

  const handleStartDateChange = (value) => {
    setFromDate(value);
  };

  const handleSubscriptionLengthChange = (value) => {
    if (value.includes("-") || value.includes(".") || value.includes(","))
      return;
    if (
      value == "" ||
      (Number.isInteger(parseInt(value)) && parseInt(value) > 0)
    ) {
      setSubscriptionLength(value);
    } else return;
  };

  const handleQtychange = (value) => {
    if (value.includes("-")) return;
    if (!validatePriceFormat(value)) {
      return;
    }
    setQty(value);
  };

  const updateHandlePress = async () => {
    if (!interval || !fromDate || !subscriptionLength || !qty) {
      return;
    }
    if (interval?.toLowerCase() === "custom" && !selectedDays?.length) {
      setError("Custom days are required for custom subscriptions");
      return;
    }
    if (uploading) return;

    setUploading(true);
    let obj = {
      customWeekdays: selectedDays,
      interval: interval,
      startDate: fromDate,
      quantity: qty,
      discount: subscriptionProduct.discount,
      price: subscriptionProduct.productprice,
      gstrate: 0,
      productname: subscriptionProduct.productname,
      manufacturer: null,
      productid: subscriptionProduct.productid,
      subscriptionLength: subscriptionLength,
    };

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

    const product = [...updatedData, obj];
    try {
      const result = await updateSubscription(
        retailerid,
        user.distributorId,
        product.filter((val) => validateSubscriptionProduct(val))
      );
      if (!result.error) {
        Alert.alert("Success", `Your subscription has been updated`);
      } else {
        Alert.alert("Error", result.error);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setUploading(false);
      getSubscriptionDetailList();
      onDismiss();
    }
  };

  return (
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
          {subscriptionProduct.productname}
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
                date={fromDate}
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
        <Text
          variant="titleMedium"
          style={{
            fontWeight: "600",
            marginTop: (height * 1) / 100,
            color: "black",
          }}
        >
          Select quantity:
        </Text>
        <TextInput
          style={{
            marginTop: (height * 1) / 100,
            marginBottom: (height * 1) / 100,
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
          value={qty.toString()}
          onChangeText={handleQtychange}
        />
        <>
          {interval == "custom" && subscriptionLength && (
            <Text
              variant="titleMedium"
              style={{
                fontWeight: "600",
                color: "black",
              }}
            >
              Select custom days:
            </Text>
          )}
          {interval == "custom" && subscriptionLength && (
            <>
              <ScrollView horizontal style={{ marginTop: (height * 1) / 100 }}>
                {weekdays?.map((days) => {
                  const isSelected = selectedDays.includes(days);
                  return (
                    <TouchableOpacity
                      key={days}
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
                      onPress={() => daysPressed(days)}
                    >
                      <Text style={{ color: "black" }}>
                        {days.substring(0, 3)}
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
          loading={uploading}
          mode="contained"
          style={{
            marginBottom: (height * 1) / 100,
            marginTop: interval !== "custom" ? (height * 1) / 100 : null,
          }}
          textColor="white"
          onPress={!uploading && updateHandlePress}
        >
          {interval ? "Update Subscription" : "Close"}
        </Button>
      </View>
    </ScrollView>
  );
};

export default EditSubscriptionModal;
