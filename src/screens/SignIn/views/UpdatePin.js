import React, { useState } from "react";
import { Text, HelperText, Button, useTheme } from "react-native-paper";
import { TextInput as MaterialTextInput } from "react-native-paper";
import { Alert, View, StyleSheet, Dimensions } from "react-native";
import { updatePin } from "../helpers/signinHelper";
import { useAuthContext } from "../../../contexts/authContext";
import Offline from "../../../component/Offline";
const { height } = Dimensions.get("screen");
function UpdatePin({ navigation, route }) {
  const theme = useTheme();

  const { mobile_no } = route.params;

  const [pin, setPin] = useState();
  const [confirmPin, setConfirmPin] = useState();
  const [errors, setErrors] = useState({});

  const validateMobile = () => {
    const regex = new RegExp(/^\d{10}$/);
    return regex.test(mobile_no);
  };
  const callUpdatePin = async () => {
    try {
      if (!validateMobile) {
        setErrors({ ...errors, mobile: "Invalid mobile no" });
        return;
      }
      if (pin.length < 4) {
        setErrors((prev) => ({ ...prev, pin: "Min pin length is 4" }));
        return;
      }
      if (pin.length > 10) {
        setErrors((prev) => ({ ...prev, pin: "Max pin length is 10" }));
        return;
      }
      if (pin !== confirmPin) {
        setErrors({ ...errors, confirm: "PINs do not match" });
        return;
      }
      updatePin({ mobile_no: mobile_no, pin })
        .then((res) => {
          if (!res.error) {
            Alert.alert("Success", res.message);
            navigation.goBack();
          } else Alert.alert("Error", res.error);
        })
        .catch((err) => {
          Alert.alert("There was an error");
        });
    } catch (err) {
      Alert.alert(err.message || "Error");
    }
  };

  return (
    <>
      <View style={styles.sogoBg}>
        <Text variant="displayMedium" style={styles.head}>
          {" "}
          SOGO
        </Text>
      </View>
      <View
        style={{
          ...styles.container,
          backgroundColor: theme.colors.background,
        }}
      >
        <MaterialTextInput
          style={{...styles.textInput,marginBottom:"5%"}}
          mode="outlined"
          label={
            <Text style={{ backgroundColor: "white", color: "gray" }}>
              New PIN
            </Text>
          }
          value={pin}
          secureTextEntry={true}
          onChangeText={(e) => {
            setErrors({ ...errors, confirm: "" });
            setPin(e);
          }}
        />
        <MaterialTextInput
          style={styles.textInput}
          mode="outlined"
          label={
            <Text style={{ backgroundColor: "white", color: "gray" }}>
              Confirm PIN
            </Text>
          }
          value={confirmPin}
          secureTextEntry={true}
          onChangeText={(e) => {
            if (pin !== e) {
              setErrors({ ...errors, confirm: "Passcodes do not match" });
            } else {
              setErrors({ ...errors, confirm: "" });
            }
            setConfirmPin(e);
          }}
        />
        <HelperText
          style={{ textAlign: "center" }}
          type="error"
          visible={errors.confirm}
        >
          {errors.confirm}{" "}
        </HelperText>
        <Button style={styles.button} mode="contained" onPress={callUpdatePin}>
          Submit new PIN
        </Button>
      </View>
    </>
  );
}
export default UpdatePin;

const styles = StyleSheet.create({
  sogoBg: {
    height: "25%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    width: "70%",
    padding: 0,
    fontSize: 15,
  },
  reset: {
    textAlign: "left",
  },
  button: {
    width: "70%",
    borderRadius: 5,
  },
  head: {
    fontFamily: "serif",
    fontWeight: "500",
    fontSize: (height * 4) / 100,
  },
});
