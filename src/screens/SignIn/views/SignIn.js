import React, { useState } from "react";
import { View, StyleSheet, Alert, Dimensions, Keyboard } from "react-native";
import { Button, Text, useTheme, HelperText } from "react-native-paper";

import { TextInput as MaterialTextInput } from "react-native-paper";
import { signIn } from "../helpers/signinHelper";
import { useAuthContext } from "../../../contexts/authContext";

const { height } = Dimensions.get("screen");
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
    padding: 0,
    fontSize: 15,
    width: "70%",
  },
  reset: {
    textAlign: "left",
  },
  button: {
    borderRadius: 5,
    width: "70%",
  },
  head: {
    fontFamily: "serif",
    fontWeight: "500",
    fontSize: (height * 4) / 100,
  },
});

function SignIn() {
  const theme = useTheme();
  const [mobileNumber, setMobileNumber] = useState();
  const [pin, setPin] = useState("");
  const [errors, setErrors] = useState({});

  const { loginUser } = useAuthContext();

  const validateMobile = () => {
    const regex = new RegExp(/^\d{10}$/);
    return regex.test(mobileNumber);
  };

  const resetInputs = () => {
    setMobileNumber();
    setOtp();
    setErrors({});
    setOtpGenerated(false);
  };

  const handleSignIn = () => {
    setErrors({});
    if (!validateMobile()) {
      setErrors({ ...errors, mobile: "Please enter a valid mobile no" });
      return;
    }
    signIn({ mobile_no: mobileNumber, pin: pin })
      .then((res) => {
        if (!res.error) {
          if (res.data.rolename === "Retailer") {
            Alert.alert(
              "Error",
              "This no. belongs to a retailer. Please log in with a distributor account."
            );
            return;
          }
          loginUser(res.data);
          resetInputs();
          Keyboard.dismiss();
        } else {
          Alert.alert("Error", res.error);
        }
      })
      .catch((err) => setErrors({ ...errors, pin: err.message }));
  };

  // to reset forgotten pin when otp function is set up
  // const handleResetPIN = () => {
  //   navigation.push("UpdatePin", { mobile_no: "", signUp: false });
  // };

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
              setMobileNumber(e.substring(0, 10));
              setErrors({ ...errors, mobile: "" });
            } else {
              setErrors({ ...errors, mobile: "Only numbers allowed" });
            }
          }}
        />
        <HelperText type="error" visible={errors.mobile}>
          {errors.mobile}{" "}
        </HelperText>

        <MaterialTextInput
          style={styles.textInput}
          mode="outlined"
          label={
            <Text style={{ backgroundColor: "white", color: "gray" }}>
              Enter PIN
            </Text>
          }
          value={pin}
          secureTextEntry={true}
          onChangeText={(e) => {
            setErrors({ ...errors, otp: "" });
            setPin(e);
          }}
        />

        {/* 
          When OTP is set up
          <Button mode="text" onPress={handleResetPIN} style={styles.reset}>
            Forgot PIN
          </Button> */}
        <HelperText
          style={{ textAlign: "center" }}
          type="error"
          visible={errors.pin}
        >
          {errors.pin}{" "}
        </HelperText>
        <Button style={styles.button} mode="contained" onPress={handleSignIn}>
          Sign In
        </Button>
      </View>
    </>
  );
}

export default SignIn;
