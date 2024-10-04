import { View, StyleSheet, FlatList, Dimensions } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Modal, Portal, Provider, Text } from "react-native-paper";
import { useAuthContext } from "../../../contexts/authContext";
import { getSubscriptionDetails } from "../../Subscription/helper/SubscriptionHelper";
import SubscriptionDetailProduct from "./SubscriptionDetailProduct";
import EditSubscriptionModal from "./EditSubscriptionModal";
import DeleteSubscription from "./DeleteSubscription";
import { useSearchContext } from "../../../contexts/SearchContext";

const { height } = Dimensions.get("screen");

const SubscriptionDetails = ({ route }) => {
  const { retailerName, retailerid } = route.params;
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  const [subscriptionDetail, setSubscriptionDetail] = useState([]);
  const [subscriptionProduct, setSubscriptionProduct] = useState(null);
  const [deleteSubProduct, setDeleteSubProduct] = useState(null);
  const { search } = useSearchContext();

  const getSubscriptionDetailList = async () => {
    try {
      setLoading(true);
      const res = await getSubscriptionDetails(user.distributorId, retailerid);
      if (res.data) {
        setSubscriptionDetail(res.data);
      }
    } finally {
      setLoading(false);
    }
  };
  const filtersubscriptionDetail = useMemo(() => {
    return (
      subscriptionDetail &&
      subscriptionDetail.filter(
        (item) =>
          search === "" ||
          item.productname.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, subscriptionDetail]);

  useEffect(() => {
    getSubscriptionDetailList();
  }, [user.distributorId, retailerid]);

  const rendersubscriptionDetail = ({ item }) => {
    return (
      <SubscriptionDetailProduct
        item={item}
        editHandlePress={(val) => setSubscriptionProduct(val)}
        deleteHandlePress={(val) => setDeleteSubProduct(val)}
      />
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            height: "auto",
            paddingBottom: 4,
            backgroundColor: "white",
            padding: 10,
          }}
        >
          <View style={styles.flexContainer}>
            <Text variant="titleMedium" style={{ width: "100%" }}>
              <Text style={{ color: "gray" }}>Customer: </Text>
              {retailerName}
            </Text>
          </View>
        </View>
        {/*
        <TextInput
          theme={{ roundness: 10 }}
          style={{
            elevation: 1,
            width: "100%",
            marginTop: 3,
          }}
          mode="outlined"
          placeholder={"Search Products"}
          onChangeText={(val) => setSearch(val.toLowerCase())}
        />*/}
      </View>
      <FlatList
        data={filtersubscriptionDetail}
        refreshing={loading}
        onRefresh={getSubscriptionDetailList}
        renderItem={rendersubscriptionDetail}
        keyboardShouldPersistTaps={"handled"}
      />
      <Provider>
        <Portal>
          <Modal
            visible={subscriptionProduct != null}
            onDismiss={() => setSubscriptionProduct(null)}
            contentContainerStyle={{
              maxHeight: (height * 70) / 100,
              width: "100%",
              position: "absolute",
              bottom: 0,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              backgroundColor: "white",
            }}
          >
            {subscriptionProduct && (
              <EditSubscriptionModal
                subscriptionProduct={subscriptionProduct}
                onDismiss={() => setSubscriptionProduct(null)}
                retailerid={retailerid}
                getSubscriptionDetailList={getSubscriptionDetailList}
                subscriptionDetail={subscriptionDetail}
              />
            )}
          </Modal>
        </Portal>
      </Provider>

      <DeleteSubscription
        subscriptionProduct={deleteSubProduct}
        onDismiss={() => setDeleteSubProduct(null)}
        subscriptionDetail={subscriptionDetail}
        getSubscriptionDetailList={getSubscriptionDetailList}
        retailerid={retailerid}
      />
    </>
  );
};

export default SubscriptionDetails;

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
    paddingHorizontal: 10,
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
    width: 60,
    height: 40,
    textAlign: "center",
    paddingHorizontal: 1,
    paddingBottom: 1,
    marginBottom: 5,
  },
  key: {
    color: "gray",
  },
});
