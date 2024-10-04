import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  Button,
  TextInput,
  Text,
  useTheme,
  HelperText,
} from "react-native-paper";
import { signUp } from "../helpers/signinHelper";

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
    height: 60,
    width: 300,
    padding: 0,
    fontSize: 15,
  },
  resend: {
    textAlign: "left",
  },
  button: {
    width: 300,
    borderRadius: 5,
  },
  head: {
    fontFamily: "serif",
    fontWeight: "500",
    fontSize: 35,
  },
});

function SignUp({ navigation }) {
  const theme = useTheme();
  const [mobileNumber, setMobileNumber] = useState();
  const [errors, setErrors] = useState({});

  const validateMobile = () => {
    const regex = new RegExp(/^\d{10}$/);
    return regex.test(mobileNumber);
  };

  const handleSignUp = () => {
    setErrors({});
    if (validateMobile()) {
      // call for signUp call
      signUp({ mobile_no: mobileNumber }).then((res) => {
        if (!res.error) {
          Alert.alert("Signed Up", "Please set a PIN");
          navigation.push("/UpdatePin", {
            mobile_no: mobileNumber,
            signUp: true,
          });
        }
      });
    } else {
      setErrors({ ...errors, mobile: "Please enter a valid mobile no." });
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
        <TextInput
          style={styles.textInput}
          mode="outlined"
          label={
            <Text style={{ backgroundColor: "white", color: "gray" }}>
              Phone Number
            </Text>
          }
          keyboardType={"numeric"}
          value={mobileNumber}
          onChangeText={(e) => {
            if (/^\d[0-9]*$/.test(e) || e === "") {
              setMobileNumber(e);
              setErrors({ ...errors, mobile: "" });
            } else {
              setErrors({ ...errors, mobile: "Only numbers allowed" });
            }
          }}
        ></TextInput>
        <HelperText type="error" visible={errors.mobile}>
          {errors.mobile}{" "}
        </HelperText>
        <Button
          style={styles.button}
          mode="contained"
          onPress={(e) => handleSignUp(e)}
        >
          Continue
        </Button>
      </View>
    </>
  );
}

export default SignUp;
