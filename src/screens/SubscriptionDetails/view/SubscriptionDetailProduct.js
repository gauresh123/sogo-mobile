import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import React from "react";
import { format } from "date-fns";
import { toTitleCase } from "../../../services/utils";
import { AntDesign } from "@expo/vector-icons";

export default function SubscriptionDetailProduct({
  item,
  editHandlePress,
  deleteHandlePress,
}) {
  return (
    <View style={styles.listcontainer}>
      <View style={{ paddingLeft: 10 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 5,
          }}
        >
          <Text style={{ width: "80%" }} variant="titleMedium">
            {item.productname}
          </Text>
          <TouchableOpacity onPress={() => editHandlePress(item)}>
            <AntDesign name="edit" size={22} color={"gray"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteHandlePress(item)}>
            <AntDesign name="delete" size={22} color={"gray"} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            ...styles.datecontainer,
            paddingTop: 3,
          }}
        >
          <Text variant="titleSmall" style={styles.key}>
            Start Date:{" "}
            <Text variant="titleSmall">
              {format(new Date(item.startdate), "dd-MM-yyyy")}
            </Text>
          </Text>
        </View>
        <Text
          style={{ paddingTop: 3, ...styles.key, width: "70%" }}
          variant="titleSmall"
        >
          No. of orders:{" "}
          <Text variant="titleSmall">{item.subscriptionlength}</Text>
        </Text>
        <Text
          style={{ paddingTop: 3, ...styles.key, width: "70%" }}
          variant="titleSmall"
        >
          Price:{" "}
          <Text variant="titleSmall">
            {`\u20B9`}
            {item.productprice}
          </Text>
        </Text>
        {item.interval === "custom" && (
          <>
            <Text
              style={{ ...styles.key, marginBottom: 4 }}
              variant="titleSmall"
            >
              Selected Days:
            </Text>
            <ScrollView
              horizontal
              style={{
                marginBottom: 6,
              }}
            >
              {item.customweekdays.map((val) => {
                return (
                  <View
                    key={val}
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
          </>
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
    </View>
  );
}

const styles = StyleSheet.create({
  listcontainer: {
    paddingHorizontal: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "silver",
    marginBottom: 2,
    width: "100%",
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
  datecontainer: {
    display: "flex",
    flexDirection: "row",
  },
  key: {
    color: "gray",
  },
});
