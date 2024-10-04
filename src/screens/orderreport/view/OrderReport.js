import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Table from "../../orderreport/view/Table";
import { Text, useTheme } from "react-native-paper";
import { TextInput as MaterialTextInput } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { format, subDays } from "date-fns";
import { getOrderReport } from "../helper/orderReportHelper";
import { useAuthContext } from "../../../contexts/authContext";
import { getDistributorCities } from "../../landingpage/helpers/landingPageHelper";
import OrderReportFilters from "./OrderReportFilters";
import statuses from "../../../constants/statusOptions";

const { height, width } = Dimensions.get("screen");

const STATUS_OPTIONS = statuses.filter((item) => item.value !== "All");

export default function OrderReport({ navigation }) {
  const { user } = useAuthContext();
  const [products, setProducts] = useState([]);
  const [fromDate, setFromDate] = useState(subDays(new Date(), 2));
  const [toDate, setToDate] = useState(new Date());
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All");
  const [shown, setShown] = useState(false);
  const [selectedList, setSelectedList] = useState(
    STATUS_OPTIONS.map((item) => item.value)
  );
  const distributorId = user.distributorId;

  useEffect(() => {
    getDistributorCities(distributorId).then((res) => {
      if (!res.error) setCities(res.data);
    });
  }, [distributorId]);

  const fetchOrderReport = () => {
    getOrderReport(
      distributorId,
      fromDate,
      toDate,
      selectedCity,
      selectedList
    ).then((res) => {
      if (!res.error) setProducts(res.data);
    });
  };

  useEffect(() => {
    fetchOrderReport();
    const unsubscribeFocus = navigation.addListener("focus", () => {
      fetchOrderReport();
    });
    return unsubscribeFocus;
  }, [distributorId, fromDate, toDate, selectedCity, selectedList]);

  const theme = useTheme();

  return (
    <>
      <View style={styles.container}>
        <View style={styles.pagecontainer}>
          <ScrollView horizontal style={{ backgroundColor: "white" }}>
            <TouchableOpacity
              style={{
                width: (width * 20) / 100,
                height: (height * 5) / 100,
                backgroundColor: theme.colors.primaryContainer,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 8,
              }}
              onPress={() => setShown(true)}
            >
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text>Filters</Text>
                <AntDesign name="filter" size={22} color="#6a1b9a" />
              </View>
            </TouchableOpacity>
            <View
              style={{
                ...styles.filter,
                borderLeftWidth: 1,
                borderColor: "silver",
              }}
            >
              <Text style={{ textAlignVertical: "top", color: "gray" }}>
                From Date
              </Text>

              <Text style={{ marginTop: 2 }}>
                {format(new Date(fromDate), "dd-MM-yyyy")}
              </Text>
            </View>

            <View style={styles.filter}>
              <Text style={{ textAlignVertical: "top", color: "gray" }}>
                To Date
              </Text>
              <Text style={{ marginTop: 2 }}>
                {format(new Date(toDate), "dd-MM-yyyy")}
              </Text>
            </View>
            <View style={styles.filter}>
              <Text style={{ textAlignVertical: "top", color: "gray" }}>
                City
              </Text>
              <Text style={{ marginTop: 2 }}>{selectedCity}</Text>
            </View>
            <View style={styles.filter}>
              <Text
                style={{
                  textAlignVertical: "top",
                  color: "gray",
                  textAlign: "center",
                }}
              >
                Status
              </Text>
              <Text style={{ marginTop: 2 }}>{selectedList.join(", ")}</Text>
              {/*<View style={{ display: "flex", flexDirection: "row" }}>
                {selectedList.map((val) => {
                  return (
                    <Text style={{ alignSelf: "center" }}>
                      {val.concat(", ")}
                    </Text>
                  );
                })}
              </View>*/}
            </View>
          </ScrollView>
        </View>
      </View>
      <ScrollView>
        <View style={styles.tablecontainer}>
          <View style={styles.tablepagecontainer}>
            {products?.length == 0 ? (
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "500",
                  fontSize: 18,
                }}
              >
                No Orders...
              </Text>
            ) : (
              <Table products={products} />
            )}
          </View>
        </View>
      </ScrollView>

      {/*filters*/}
      <OrderReportFilters
        shown={shown}
        setShown={setShown}
        // city filter
        cities={cities}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        // date filters
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
        // status filter
        statuses={STATUS_OPTIONS}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: "2%",
    width: "100%",
  },
  list: {
    width: "100%",
    padding: "2%",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  pagecontainer: {
    width: "100%",
  },
  tablecontainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingLeft: "2%",
    paddingRight: "2%",
    width: "100%",
  },
  tablepagecontainer: {
    width: "100%",
  },
  input: {
    width: "100%",
    height: 50,
    marginBottom: "1%",
  },
  rightitems: {
    position: "absolute",
    right: 10,
  },
  listcontainer: {
    width: "95%",
    backgroundColor: "#fafafa",
    borderRadius: 10,
    marginLeft: "3%",
    padding: 10,
    marginBottom: "1%",
    position: "relative",
    borderColor: "silver",
    borderWidth: 1,
  },
  locationcontainer: {
    display: "flex",
    flexDirection: "column",
  },
  newlocationcontainer: {
    display: "flex",
    flexDirection: "row",
    marginBottom: "3%",
  },
  reportHead: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 10,
    backgroundColor: "lightgray",
  },
  reportdata: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "#fafafa",
    padding: 10,
  },
  filter: {
    width: "auto",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    paddingHorizontal: 25,
    borderRightWidth: 1,
    borderColor: "silver",
    paddingVertical: 5,
    backgroundColor: "white",
  },
});
