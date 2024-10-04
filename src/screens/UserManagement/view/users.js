import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getDistributorUsers } from "../helper/userHelper";
import { useAuthContext } from "../../../contexts/authContext";
import { useSearchContext } from "../../../contexts/SearchContext";

export default function Users({ navigation, route }) {
  const { roles } = route.params;
  const { user } = useAuthContext();
  const { search, setSearch } = useSearchContext();
  const [userList, setUserList] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [showemptyuserMessage, setShowemptyuserMessage] = useState(false);
  useEffect(() => {
    getUsers();
  }, [user.distributorId]);

  useEffect(() => {
    let unsubscribeFocus = navigation.addListener("focus", () => {
      getUsers();
      setSearch("");
    });

    return unsubscribeFocus;
  }, [navigation]);

  const filtereUserList = useMemo(() => {
    return (
      userList &&
      userList.filter(
        (val) =>
          search === "" ||
          val.username.toLowerCase().includes(search.toLowerCase()) ||
          val.mobileno?.includes(search)
      )
    );
  }, [search, userList]);

  const getUsers = async () => {
    setShowemptyuserMessage(false);
    setRefreshing(true);
    try {
      const res = await getDistributorUsers(user.distributorId);
      if (res.data.length > 0) {
        setUserList(res.data);
      } else {
        setShowemptyuserMessage(true);
      }
    } catch {
      Alert.alert("Error", "Failed to fetch users");
    } finally {
      setRefreshing(false);
    }
  };

  const userPressed = async (item) => {
    if (roles) {
      navigation.navigate("editUser", {
        item: item,
        userSubrole: roles?.find((val) => val.name == item.subrole),
      });
    }
  };
  const renderUser = useCallback(({ item }) => {
    return (
      <TouchableOpacity style={styles.users} onPress={() => userPressed(item)}>
        <Text>{item.username}</Text>
      </TouchableOpacity>
    );
  }, []);

  const userKeyExtractor = (item) => item.userid;

  return (
    <View style={styles.container}>
      <FlatList
        style={{ width: "100%" }}
        keyboardShouldPersistTaps={"handled"}
        data={filtereUserList}
        renderItem={renderUser}
        keyExtractor={userKeyExtractor}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getUsers} />
        }
      />
      {showemptyuserMessage && (
        <View
          style={{
            alignSelf: "center",
            marginTop: 100,
          }}
        >
          <Text>Sorry you don't have any user....</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    padding: 10,
  },
  users: {
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
