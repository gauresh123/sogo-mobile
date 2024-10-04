import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { Text, List } from "react-native-paper";
import { useAuthContext } from "../contexts/authContext";
import { StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import useSubroles from "../hooks/useSubroles";
import WithPermission from "../component/WithPermission";

function Menu({ navigation }) {
  const { user, logoutUser } = useAuthContext();
  const { roles } = useSubroles();
  return (
    <>
      <List.Item
        title="My Products"
        left={(props) => <FontAwesome name="shopping-bag" {...props} />}
        onPress={() => navigation.navigate("MyProducts")}
        style={styles.listItem}
      />
      <List.Item
        title="Add Customer"
        left={(props) => <FontAwesome name="user" {...props} />}
        onPress={() => navigation.navigate("AddRetailer")}
        style={styles.listItem}
      />
      <WithPermission permission="CREATE_DISTRIBUTOR_USER">
        <List.Item
          title="My Users"
          left={(props) => <FontAwesome name="user" {...props} />}
          onPress={() =>
            navigation.push("user", {
              roles: roles,
            })
          }
          style={styles.listItem}
        />
      </WithPermission>

      <List.Item
        title="Update Pin"
        left={(props) => <AntDesign name="edit" {...props} />}
        onPress={() =>
          navigation.push("UpdatePin", { mobile_no: user.mobileNo })
        }
        style={styles.listItem}
      />
      <List.Item
        title="Sign Out"
        left={(props) => <AntDesign name="logout" {...props} />}
        onPress={logoutUser}
        style={styles.listItem}
      />
    </>
  );
}

export default Menu;

const styles = StyleSheet.create({
  listItem: {
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },
});
