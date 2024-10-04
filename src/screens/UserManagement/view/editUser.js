import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Button, HelperText, TextInput, useTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuthContext } from "../../../contexts/authContext";

import Popup from "../../../component/Popup";
import useSubroles from "../../../hooks/useSubroles";
import { editUserData } from "../helper/userHelper";

const { height } = Dimensions.get("screen");

const EditUser = ({ navigation, route }) => {
  const theme = useTheme();
  const { item, userSubrole } = route.params;
  const { user } = useAuthContext();
  const { roles } = useSubroles();
  const [userData, setUserData] = useState({
    userName: item.username,
    mobileNo: item.mobileno,
    city: item.city,
    subrole: userSubrole,
  });
  const [showRoles, setShowRoles] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setUserData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    handleChange(
      "subrole",
      roles?.find((role) => role.id == userSubrole?.id)
    );
  }, [roles]);

  const validateInput = () => {
    const temp = {};
    if (!userData.userName) temp.userName = "User Name is required";
    if (userData.mobileNo?.length != 10)
      temp.mobileNo = "Please enter a valid mobile no";
    if (!userData.subrole) temp.subrole = "Role is required";

    setErrors(temp);

    return !Object.keys(temp).length > 0;
  };

  const editNewUser = async () => {
    if (!validateInput()) return;
    try {
      setLoading(true);
      const result = await editUserData(
        item.userid,
        userData.userName,
        userData.mobileNo,
        user.city,
        1,
        userData.subrole.id
      );
      if (!result.message) {
        Alert.alert("Success", "User Edited!");
        navigation.goBack();
      } else {
        Alert.alert("Error", result.message);
      }
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ width: "100%", marginTop: (height * 3) / 100 }}>
          <TextInput
            mode="outlined"
            style={styles.input}
            placeholder="User Name"
            placeholderTextColor={"gray"}
            value={userData.userName}
            onChangeText={(val) => handleChange("userName", val)}
          />
          {errors.userName && (
            <HelperText visible={errors.userName} type={"error"}>
              {errors.userName}{" "}
            </HelperText>
          )}
        </View>
        <View
          style={{
            width: "100%",
            marginTop: errors.userName ? null : (height * 3) / 100,
          }}
        >
          <TextInput
            mode="outlined"
            style={styles.input}
            placeholder="Mobile Number"
            placeholderTextColor={"gray"}
            value={userData.mobileNo}
            onChangeText={(val) => {
              if (Number(val) || val === "" || val === "0") {
                handleChange("mobileNo", val?.substring(0, 10));
              }
            }}
          />
          {errors.mobileNo && (
            <HelperText visible={errors.mobileNo} type={"error"}>
              {errors.mobileNo}{" "}
            </HelperText>
          )}
        </View>

        <View
          style={{
            width: "100%",
            marginTop: errors.mobileNo ? null : (height * 3) / 100,
          }}
        >
          <TouchableOpacity onPress={() => setShowRoles(true)}>
            <View
              style={{
                width: "100%",
                backgroundColor: theme.colors.background,
                borderColor: "gray",
                borderWidth: 1,
                padding: "3.5%",
                borderRadius: 5,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: (height * 1.6) / 100,
                }}
              >
                {userData.subrole?.name || "Select Role"}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={23} color="gray" />
            </View>
          </TouchableOpacity>
          {errors.subrole && (
            <HelperText visible={errors.subrole} type={"error"}>
              {errors.subrole}{" "}
            </HelperText>
          )}
        </View>
        <View
          style={{
            display: "flex",
            marginTop: (height * 3) / 100,
            justifyContent: "flex-end",
            flexDirection: "row",
            width: "96%",
            marginHorizontal: "2%",
          }}
        >
          <Button
            style={{
              width: 100,
              marginBottom: 25,
            }}
            onPress={() => navigation.goBack()}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            style={{
              width: 100,
              marginBottom: 25,
            }}
            onPress={!loading && editNewUser}
            loading={loading}
          >
            Edit
          </Button>
        </View>
      </ScrollView>

      <Popup
        visible={showRoles}
        onDismiss={() => setShowRoles(false)}
        value={userData.subrole?.id}
        showSearch={false}
        onClick={(val) => handleChange("subrole", val)}
        data={roles}
        labelField={"name"}
        valueField="value"
      />
    </>
  );
};

export default EditUser;

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
  },
  input: {
    width: "100%",
    borderRadius: 10,
    elevation: 0,
  },
});
