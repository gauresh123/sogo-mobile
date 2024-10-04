import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text, TextInput } from "react-native-paper";
import React, { useEffect, useMemo, useState } from "react";

import { getSubscribedRetailers } from "../../Subscription/helper/SubscriptionHelper";
import { useAuthContext } from "../../../contexts/authContext";
import { useSearchContext } from "../../../contexts/SearchContext";

const { height } = Dimensions.get("screen");

const MySubscription = ({ navigation }) => {
  const [subscribedRetailers, setSubbscribedRetailers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  const { search, setSearch } = useSearchContext();

  const getSubscribedRetailerList = async () => {
    try {
      setLoading(true);
      const res = await getSubscribedRetailers(user.distributorId);
      if (!res.error) {
        setSubbscribedRetailers(res.data);
      }
    } catch (error) {
      //
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let unsubscribeFocus = navigation.addListener("focus", () => {
      getSubscribedRetailerList();
    });

    return unsubscribeFocus;
  }, [user.distributorId]);

  useEffect(() => {
    getSubscribedRetailerList();
  }, [user.distributorId]);

  const filtersubscribedRetailers = useMemo(() => {
    return (
      subscribedRetailers &&
      subscribedRetailers.filter(
        (retailer) =>
          search === "" ||
          retailer.retailername.toLowerCase().includes(search.toLowerCase()) ||
          retailer.mobileno?.includes(search.toLowerCase())
      )
    );
  }, [search, subscribedRetailers]);

  useEffect(() => {
    let unsubscribeFocus = navigation.addListener("focus", () => {
      setSearch("");
    });

    return unsubscribeFocus;
  }, [navigation]);

  const subscriptionHandlePressed = (item) => {
    navigation.navigate(`SubscriptionDetails`, {
      retailerName: item.retailername,
      retailerid: item.retailerid,
    });
    setSearch("");
  };
  const renderSubscriptions = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.listcontainer}
        onPress={() => subscriptionHandlePressed(item)}
      >
        <View style={styles.flexcontainer}>
          <Text variant="titleMedium">{item.retailername}</Text>
          <Text>{/* <AntDesign name="delete" size={18} />*/}</Text>
        </View>
        {/*<View>
          <Text style={{ paddingVertical: 10 }}>Start Date: 25-05-2023</Text>
          <Text>End Date: 31-05-2023</Text>
    </View>*/}
        <Text
          style={{ paddingVertical: 10, color: "gray" }}
          variant="titleSmall"
        >
          Number of Subscriptions:{" "}
          <Text variant="titleSmall">{item.products}</Text>
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <View style={styles.container}>
        {/*
        <TextInput
          theme={{ roundness: 10 }}
          style={styles.input}
          mode="outlined"
          placeholder="Search Customers"
          onChangeText={(val) => setSearch(val.toLowerCase())}
  />*/}
      </View>
      <FlatList
        refreshing={loading}
        onRefresh={getSubscribedRetailerList}
        data={filtersubscribedRetailers}
        keyboardShouldPersistTaps={"handled"}
        renderItem={renderSubscriptions}
      />
    </>
  );
};

export default MySubscription;

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 10,
    width: "100%",
  },
  input: {
    width: "100%",
    marginBottom: (height * 1.5) / 100,
    marginTop: (height * 1.5) / 100,
  },
  listcontainer: {
    width: "96%",
    height: "auto",
    backgroundColor: "#fafafa",
    borderRadius: 10,
    marginHorizontal: 10,
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
  flexcontainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
