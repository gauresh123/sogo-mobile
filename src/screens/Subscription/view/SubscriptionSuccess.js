import { View, FlatList, StyleSheet, ScrollView } from "react-native";
import { Button, Text } from "react-native-paper";
import React from "react";
import { format } from "date-fns";
import { toTitleCase } from "../../../services/utils";
import { useCartContext } from "../../../contexts/CartContext";

const SubscriptionSuccess = ({ navigation, route }) => {
  const { cartItems, clearCartContext } = useCartContext();

  const backHandlePress = () => {
    navigation.goBack();
    clearCartContext();
  };

  const renderProduct = ({ item }) => {
    return (
      <View style={styles.listcontainer}>
        <Text style={{ width: "90%", marginTop: 5 }} variant="titleMedium">
          {item.productname}
        </Text>
        <View
          style={{
            ...styles.datecontainer,
            paddingTop: 3,
          }}
        >
          <Text variant="titleSmall" style={styles.key}>
            Start Date:{" "}
            <Text variant="titleSmall">
              {format(new Date(item.startDate), "dd-MM-yyyy")}
            </Text>
          </Text>
          {/*
          <Text style={{ paddingLeft: 5, ...styles.key }} variant="titleSmall">
            End:{" "}
            <Text variant="titleSmall">
              {format(
                addDays(new Date(), parseFloat(item.subscriptionLength)),
                "dd-MM-yyyy"
              )}
            </Text>
              </Text>*/}
        </View>
        <Text
          style={{ paddingTop: 3, ...styles.key, width: "70%" }}
          variant="titleSmall"
        >
          No. of orders:{" "}
          <Text variant="titleSmall">{item.subscriptionLength}</Text>
        </Text>
        <Text
          style={{ paddingTop: 3, ...styles.key, width: "70%" }}
          variant="titleSmall"
        >
          Price:{" "}
          <Text variant="titleSmall">
            {`\u20B9`}
            {item.price}
          </Text>
        </Text>
        {item.interval == "custom" && (
          <Text style={{ ...styles.key, marginBottom: 4 }} variant="titleSmall">
            Selected Days:
          </Text>
        )}
        {item.interval == "custom" && (
          <ScrollView horizontal style={{ marginBottom: 6 }}>
            {item.customWeekdays.map((val, i) => {
              return (
                <View
                  key={i}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    marginRight: 15,
                    borderWidth: 1,
                    borderColor: "gray",
                    borderRadius: 8,
                  }}
                >
                  <Text>{val.substring(0, 3)}</Text>
                </View>
              );
            })}
          </ScrollView>
        )}
        <View
          style={{
            ...styles.datecontainer,
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{ width: "70%", paddingTop: 3, ...styles.key }}
            variant="titleSmall"
          >
            Subscription Type:{" "}
            <Text variant="titleSmall">{toTitleCase(item.interval)}</Text>
          </Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text style={{ alignSelf: "center" }} variant="titleSmall">
              Qty:{" "}
            </Text>
            <View style={styles.unitInput}>
              <Text variant="titleSmall">{item.quantity}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  const KeyExtractor = (item) => item.productid;
  return (
    <>
      <FlatList
        data={cartItems}
        renderItem={renderProduct}
        keyExtractor={KeyExtractor}
      />
      <Button
        style={styles.orderButton}
        onPress={backHandlePress}
        mode="contained"
      >
        Go back
      </Button>
    </>
  );
};

export default SubscriptionSuccess;

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 10,
    width: "100%",
  },
  flexContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  input: {
    width: "100%",
  },
  listcontainer: {
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "silver",
    marginBottom: 2,
    width: "100%",
  },
  datecontainer: {
    display: "flex",
    flexDirection: "row",
  },
  unitInput: {
    paddingHorizontal: 1,
    paddingBottom: 1,
    marginBottom: 5,
    width: 60,
    height: 40,
    backgroundColor: "#e7dfec",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  key: {
    color: "gray",
  },
  orderButton: {
    width: "100%",
    paddingVertical: 5,
    bottom: 0,
    borderRadius: 3,
  },
});
