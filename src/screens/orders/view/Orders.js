import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  RefreshControl,
  Dimensions,
  Keyboard,
} from "react-native";
import { TextInput, Text, HelperText, useTheme } from "react-native-paper";
import { endOfMonth, format, isAfter, max, subDays } from "date-fns";
import { useAuthContext } from "../../../contexts/authContext";
import { getLastOrderDate, getOrders } from "../helpers/ordersHelper";
import UpdateOrderStatus from "./UpdateOrderStatus";
import { AntDesign } from "@expo/vector-icons";
import { getDistributorCities } from "../../landingpage/helpers/landingPageHelper";
import OrderFilters from "./OrderFilters";
import PaymentStatusPopup from "./PaymentStatusPopup";
import HorizontalDatePicker from "../../../component/HorizontalDatePicker";
import { useSearchContext } from "../../../contexts/SearchContext";

const { height } = Dimensions.get("screen");

export default function Orders({ navigation }) {
  const { user } = useAuthContext();
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(true);
  const [orders, setOrders] = useState([]);
  const [editStatusData, setEditStatusData] = useState({});
  const [fromDate, setFromDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());
  const [status, setStatus] = useState("All");
  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All");
  const [visible, setVisible] = useState(false);
  const [paymentItem, setPaymentItem] = useState(null);
  const [lastOrderDate, setLastOrderDate] = useState(new Date());
  const [paymentStatus, setPaymentStatus] = useState("All");
  const { search, shown, setShown, setSearch } = useSearchContext();

  const handleDateClick = (val) => {
    setFromDate(val);
    setEndDate(val);
  };

  const showUpdateStatus = (orderid, currentStatus) => {
    setEditStatusData({ ...editStatusData, orderid: orderid, currentStatus });
    setVisible(true);
  };
  const hideUpdateStatus = () => {
    setEditStatusData({});
    setVisible(false);
  };

  useEffect(() => {
    getDistributorCities(user.distributorId).then((res) => {
      if (!res.error) setCities(res.data);
    });
  }, [user.distributorId]);

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", fetchOrders);
    const unsubscribeBlur = navigation.addListener("blur", () => {
      setShown(false);
    });
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [
    selectedCity,
    user.distributorId,
    fromDate,
    endDate,
    status,
    paymentStatus,
  ]);

  useEffect(() => {
    let unsubscribeFocus = navigation.addListener("focus", () => {
      setSearch("");
    });

    return unsubscribeFocus;
  }, [navigation]);

  useEffect(() => {
    fetchOrders();
  }, [selectedCity, user.distributorId, fromDate, endDate, status]);

  {
    /*const filterHandlePress = () => {
    setShown(true);
    Keyboard.dismiss();
  };*/
  }

  const fetchOrders = async () => {
    setRefreshing(true);
    try {
      const result = await getOrders(
        user.distributorId,
        fromDate,
        endDate,
        selectedCity,
        status
      );
      if (!result.error) {
        setOrders(result.data);
        setErrors({ ...errors, getOrders: "" });
      } else {
        setErrors({ ...errors, getOrders: "Failed to fetch orders" });
      }
      getLastOrderDate(user.distributorId).then((res) => {
        if (!res.error && res.data.date !== null)
          setLastOrderDate(res.data.date);
      });
    } catch (error) {
      setErrors({ ...errors, getOrders: "Failed to fetch orders" });
    } finally {
      setRefreshing(false);
    }
  };

  const redirect = (order) => {
    navigation.navigate("OrderDetails", { order: order });
    setSearch("");
  };

  const filteredOrders = useMemo(() => {
    return orders?.filter(
      (order) =>
        (search === "" ||
          order.name.toLowerCase().includes(search.toLowerCase()) ||
          order.mobileno?.includes(search.toLowerCase())) &&
        (paymentStatus === "All" || paymentStatus === order.ispaid)
    );
  }, [orders, search, paymentStatus]);

  const paymentStatusPressed = (item) => {
    setPaymentItem(item);
  };

  const renderOrder = useCallback(({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => redirect(item)}
        style={styles.listcontainer}
      >
        <Text
          variant="titleMedium"
          style={{
            fontWeight: "400",
            paddingBottom: (height * 1) / 100,
            width: "50%",
            fontSize: (height * 1.8) / 100,
          }}
        >
          {item.name}
        </Text>
        <View style={styles.leftitems}>
          <Text style={{ marginBottom: 5 }}>Order ID: {item.orderid}</Text>
          <Text>Date: {format(new Date(item.orderdate), "dd-MM-yyyy")}</Text>
        </View>
        <View style={styles.rightitems}>
          <Text
            variant="titleSmall"
            style={{ paddingTop: 5, textAlign: "right", paddingBottom: 3 }}
          >
            Amt : {`\u20B9`} {Number(item.totalamount).toFixed(2)}
          </Text>
          <TouchableOpacity
            onPress={() => showUpdateStatus(item.orderid, item.orderstatus)}
            style={{
              textAlignVertical: "center",
              paddingHorizontal: 5,
              paddingVertical: 3,
              borderRadius: 5,
              backgroundColor: theme.colors.secondaryContainer,
              marginBottom: 3,
            }}
          >
            <Text
              style={{
                paddingHorizontal: 5,
                paddingVertical: 3,
              }}
            >
              Status: {item.orderstatus}{" "}
              <AntDesign size={10} name="caretdown" color="gray" />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: 2,
              alignSelf: "flex-end",
              paddingHorizontal: 12,
              justifyContent: "center",
              borderWidth: item.ispaid ? 0 : 1.5,
              borderRadius: 8,
              backgroundColor: item.ispaid ? "#50C878" : "white",
              borderColor: item.ispaid ? "#008069" : "gray",
            }}
            onPress={() => paymentStatusPressed(item)}
          >
            <Text
              style={{
                fontWeight: "bold",
                color: item.ispaid ? "white" : "gray",
              }}
            >
              {item.ispaid == true ? "PAID" : "UNPAID"}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.pagecontainer}>
          <HorizontalDatePicker
            fromDate={fromDate}
            toDate={endDate}
            endDate={
              isAfter(endOfMonth(new Date()), new Date(lastOrderDate))
                ? endOfMonth(new Date())
                : lastOrderDate
            }
            onDateClick={handleDateClick}
          />
          {/*
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TextInput
              theme={{ roundness: 10 }}
              style={styles.input}
              value={search}
              mode="outlined"
              onChangeText={(text) => setSearchFilter(text)}
              placeholder={shown ? "" : "Search Customers"}
              editable={shown ? false : true}
            />
            <View style={styles.filtericon}>
              <TouchableOpacity onPress={filterHandlePress}>
                <AntDesign
                  name="filter"
                  size={25}
                  color="#6a1b9a"
                  style={{ alignSelf: "center" }}
                />
                <Text
                  style={{ fontSize: (height * 1.3) / 100, color: "#6a1b9a" }}
                >
                  Filters
                </Text>
              </TouchableOpacity>
            </View>
          </View>*/}

          {errors.getOrders && (
            <HelperText visible={errors.getOrders} type="error">
              {errors.getOrders}{" "}
            </HelperText>
          )}
        </View>
      </View>
      <FlatList
        data={filteredOrders}
        keyboardShouldPersistTaps={"handled"}
        renderItem={renderOrder}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchOrders} />
        }
      />
      <UpdateOrderStatus
        value={editStatusData}
        hideModal={hideUpdateStatus}
        visible={visible}
        fetchOrders={fetchOrders}
      />

      {/*filters*/}
      <OrderFilters
        shown={shown}
        cities={cities}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        status={status}
        setStatus={setStatus}
        fromDate={fromDate}
        setFromDate={setFromDate}
        endDate={endDate}
        setEndDate={setEndDate}
        setShown={setShown}
        paymentStatus={paymentStatus}
        setPaymentStatus={setPaymentStatus}
      />
      <PaymentStatusPopup
        shown={paymentItem !== null}
        onDismiss={() => setPaymentItem(null)}
        item={paymentItem}
        fetchOrders={fetchOrders}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 10,
    width: "100%",
  },
  pagecontainer: {
    width: "100%",
  },
  input: {
    width: "88%",
    marginBottom: (height * 1.5) / 100,
    marginTop: (height * 1.5) / 100,
  },
  leftitems: {
    width: "60%",
    display: "flex",
    justifyContent: "space-between",
  },
  rightitems: {
    position: "absolute",
    right: 12,
    paddingVertical: 12,
  },
  listcontainer: {
    width: "95%",
    minHeight: (height * 15) / 100,
    backgroundColor: "#fafafa",
    borderRadius: 10,
    marginLeft: "3%",
    padding: 10,
    marginBottom: "3%",
    marginTop: "1%",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    paddingBottom: 5,
  },
  locationcontainer: {
    display: "flex",
    flexDirection: "row",
    padding: "3%",
    width: "100%",
    paddingTop: (height * 2) / 100,
    paddingBottom: (height * 2) / 100,
  },
  newlocationcontainer: {
    display: "flex",
    flexDirection: "row",
    marginBottom: "3%",
  },
  popup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 200,
  },
  filtericon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 7,
  },
});
