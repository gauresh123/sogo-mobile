import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  RefreshControl,
  Dimensions,
  Linking,
  Alert,
} from "react-native";
import { TextInput, Text, useTheme } from "react-native-paper";
import Popup from "../../../component/Popup";
import { useAuthContext } from "../../../contexts/authContext";
import {
  getRetailers,
  getDistributorCities,
} from "../helpers/landingPageHelper";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Entypo,
  FontAwesome5,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import OutletAddress from "../../OrderDetails/views/OutletAddress";
import CheckOutdetail from "./CheckOutdetail";
import { useSearchContext } from "../../../contexts/SearchContext";
import { useCartContext } from "../../../contexts/CartContext";

const { height } = Dimensions.get("screen");

export default function LandingScreen({ navigation }) {
  const theme = useTheme();
  const { user, routeName } = useAuthContext();
  const RNNavigation = useNavigation();
  const [refreshing, setRefreshing] = useState(true);
  const [retailers, setRetailers] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(user.city);
  const [errors, setErrors] = useState({});
  const [filterText, setFilterText] = useState("");
  const [flag, setFlag] = useState(false);
  const [addressRetailerId, setAddressRetailerId] = useState(null);
  const [checkInRetailerId, setCheckInRetailerId] = useState(null);
  const [retailerName, setRetailerName] = useState("");
  const [retailernum, setRetailerNum] = useState("");
  const [refreshStores, setRefreshStores] = useState(true);
  const { search, setSearch } = useSearchContext();
  const { clearCartContext, setCartInfo } = useCartContext();

  useEffect(() => {
    fetchDistributorCities();
  }, [user.distributorId]);

  useEffect(() => {
    getStores();
  }, [user.distributorId, selectedCity, refreshStores]);

  useEffect(() => {
    let unsubscribeFocus = () => {};
    if (routeName === "UpdateOrder") {
      unsubscribeFocus = navigation.addListener("focus", () => {
        RNNavigation.reset({
          index: 1,
          routes: [{ name: "OrdersList" }],
        });
      });
    }
    return unsubscribeFocus;
  }, [navigation]);

  useEffect(() => {
    let unsubscribeFocus = navigation.addListener("focus", () => {
      setRefreshStores((prev) => !prev);
      clearCartContext();
    });

    return unsubscribeFocus;
  }, [refreshStores]);

  useEffect(() => {
    let unsubscribeFocus = navigation.addListener("focus", () => {
      setSearch("");
    });

    return unsubscribeFocus;
  }, [navigation]);

  useEffect(() => {
    let unsubscribeFocus = () => {};
    if (routeName === "UpdateOrder") {
      unsubscribeFocus = navigation.addListener("focus", () => {
        RNNavigation.reset({
          index: 0,
          routes: [{ name: "OrdersList" }],
        });
      });
    }
    return unsubscribeFocus;
  }, [navigation, routeName]);

  const fetchDistributorCities = () => {
    getDistributorCities(user.distributorId).then((res) => {
      if (!res.error) {
        setCities(res.data);
        if (res.data.length == 2) setSelectedCity(res.data[0].value);
      }
    });
  };
  const getStores = async () => {
    if (!user) return;
    setRefreshing(true);
    getRetailers(user.distributorId, selectedCity)
      .then((res) => {
        if (!res.error) setRetailers(res.data);
      })
      .catch(() =>
        setErrors({ ...errors, retailers: "Couldn't get retailers" })
      )
      .finally(() => {
        setRefreshing(false);
      });
  };

  const handlePress = (item) => {
    navigation.navigate(`CreateOrder`, {
      retailerName: item.name,
      retailerId: item.userid,
      retailerNumber: item.mobileno,
      subscriptionenabled: item.subscriptionenabled,
    });
    setSearch("");
  };

  const addressHandlePress = (item) => {
    setAddressRetailerId(item.userid);
    setRetailerName(item.name);
    setRetailerNum(item.mobileno);
  };

  const filteredRetailers = useMemo(() => {
    return (
      retailers &&
      retailers.filter(
        (retailer) =>
          search === "" ||
          retailer.name.toLowerCase().includes(search.toLowerCase()) ||
          retailer.mobileno?.includes(search.toLowerCase())
      )
    );
  }, [search, retailers, selectedCity]);
  const checkedInPressed = (item) => {
    setCheckInRetailerId(item.userid);
  };

  const phonePressed = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const subscriptionPressed = (item) => {
    if (!item.subscriptionenabled) {
      Alert.alert("", "Sorry subscription is not enabled for this retailer");
      return;
    }
    navigation.navigate(`CreatSubOrder`, {
      retailerName: item.name,
      retailerId: item.userid,
      retailerNumber: item.mobileno,
    });
    setCartInfo((prev) => ({
      ...prev,
      action: "subscribe",
      retailerName: item.name,
      retailerId: item.userid,
    }));
  };

  const renderRetailer = useCallback(({ item, key }) => {
    return (
      <TouchableOpacity
        key={key}
        style={styles.list}
        onPress={() => handlePress(item)}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text variant="titleMedium" style={{ width: "70%" }}>
            {item.name}
          </Text>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              paddingLeft: "1.5%",
            }}
          >
            <TouchableOpacity onPress={() => addressHandlePress(item, key)}>
              <Text>
                <Entypo name="shop" size={16.5} color={theme.colors.primary} />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ paddingLeft: "7%" }}
              onPress={() => checkedInPressed(item)}
            >
              <Text>
                <Entypo
                  name="location"
                  size={16.5}
                  color={theme.colors.primary}
                />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ paddingLeft: "7%" }}
              onPress={() => phonePressed(item.mobileno)}
            >
              <Text>
                <Entypo name="phone" size={16.5} color={theme.colors.primary} />
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ paddingLeft: "7%" }}
              onPress={() => subscriptionPressed(item)}
            >
              <Text>
                <FontAwesome
                  name={item.subscriptionenabled ? "bell" : "bell-o"}
                  size={16.5}
                  color={
                    item.subscriptionenabled ? theme.colors.primary : "black"
                  }
                />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={{ marginTop: 1, color: "gray" }} variant="bodySmall">
          {item.mobileno}
        </Text>
      </TouchableOpacity>
    );
  }, []);

  const retailerKeyExtractor = (item) => item.userid;

  return (
    <>
      <View
        style={{
          ...styles.container,
          // last item not visible without flex
          //flex: flag || addressRetailerId || checkInRetailerId ? 100 : 1,
          flex: 700,
        }}
      >
        <View
          style={{
            ...styles.pagecontainer,
            // flex: flag || addressRetailerId || checkInRetailerId ? 100 : 1,
            flex: 700,
          }}
        >
          {cities.length > 2 && (
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16.5,
                  paddingLeft: "4%",
                  alignSelf: "center",
                  width: "20%",
                }}
                variant="titleMedium"
              >
                City:
              </Text>
              <TouchableOpacity
                style={{ width: "80%" }}
                onPress={() => setFlag(true)}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    padding: "3.5%",
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "500",
                      fontSize: (height * 1.8) / 100,
                      alignSelf: "center",
                    }}
                    variant="titleMedium"
                  >
                    {selectedCity}
                  </Text>

                  <MaterialIcons
                    name="arrow-drop-down"
                    size={23}
                    color="gray"
                  />
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/*
          <TextInput
            style={styles.input}
            mode={"outlined"}
            theme={{ roundness: 10 }}
            placeholder="Search Customers"
            onChangeText={(text) => setFilterText(text.toLowerCase())}
                />*/}

          <FlatList
            style={{ width: "100%" }}
            keyExtractor={retailerKeyExtractor}
            keyboardShouldPersistTaps={"handled"}
            data={filteredRetailers}
            renderItem={renderRetailer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => getStores()}
              />
            }
          />
        </View>
      </View>

      {/*city*/}
      <Popup
        visible={flag}
        onDismiss={() => setFlag(false)}
        onShow={() => setFlag(true)}
        value={selectedCity}
        showSearch={cities.length > 7}
        searchPlaceholder="Search City"
        onClick={(val) => setSelectedCity(val.value)}
        data={cities}
      />

      {/*OutletAddress*/}
      <OutletAddress
        visible={addressRetailerId}
        onDismiss={() => setAddressRetailerId(null)}
        userId={addressRetailerId}
        retailerName={retailerName}
        mobileno={retailernum}
      />
      {/*checkout*/}
      <CheckOutdetail
        visible={checkInRetailerId}
        onDismiss={() => setCheckInRetailerId(null)}
        retailerId={checkInRetailerId}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    padding: 10,
  },
  pagecontainer: {
    width: "100%",
  },
  btn: {
    width: "100%",
    padding: 20,
    backgroundColor: "darkblue",
    alignItems: "center",
    marginBottom: "5%",
  },
  input: {
    marginBottom: "3%",
    width: "100%",
    marginTop: 10,
    elevation: 1,
  },
  list: {
    width: "100%",
    height: "auto",
    padding: 20,
    borderRadius: 15,
    marginBottom: "3%",
    backgroundColor: "#fafafa",
    borderColor: "silver",
    borderWidth: 1,
  },
});
