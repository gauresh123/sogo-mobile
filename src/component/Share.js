import React, { useEffect, useState } from "react";
import {
  Dimensions,
  View,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { Modal, Portal, Provider, Text } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useAuthContext } from "../contexts/authContext";
import { createForm } from "../screens/SalesOrder/helpers/ShareHelper";
import * as SMS from "expo-sms";

const { width } = Dimensions.get("screen");
const { height } = Dimensions.get("screen");

const ShareLink = ({ visible, onDismiss, retailerId, retailerNumber }) => {
  const { user } = useAuthContext();
  const [num, setNum] = useState(retailerNumber);
  let id;
  let link = "http://live.thesogo.com/weblinkform";
  const whatsappLinking = async () => {
    let url =
      "whatsapp://send?text=" +
      `Place your order using the link : ${link}/${id}` +
      "&phone=91" +
      num;
    await Linking.openURL(url)
      .then((data) => {
        if (!data) {
          Alert.alert("make sure whatsApp installed");
        }
      })
      .catch((err) => {
        Alert.alert("make sure whatsApp installed");
      });
  };

  const smsLinking = async () => {
    let url = `Place your order using the link :${link}/${id}`;
    try {
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        await SMS.sendSMSAsync(num, url);
      } else {
        Alert.alert("there's no SMS available on this device");
      }
    } catch (err) {
      Alert.alert("Sorry Opration Failed");
    }
  };

  const whtsappHandlePress = async () => {
    const formdata = await createForm(user.distributorId, retailerId);
    id = formdata.data.formid;
    whatsappLinking();
    onDismiss();
  };

  const smsHandlePress = async () => {
    const formdata = await createForm(user.distributorId, retailerId);
    id = formdata.data.formid;
    smsLinking();
    onDismiss();
  };
  return (
    <>
      <Provider>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={onDismiss}
            contentContainerStyle={{
              position: "absolute",
              right: 0,
              top: 0,
              backgroundColor: "white",
              width: "60%",
              minHeight: (height * 9) / 100,
              borderRadius: 10,
            }}
          >
            <Text
              style={{ textAlign: "center", marginBottom: (height * 2) / 100 }}
              variant="titleMedium"
            >
              Share
            </Text>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginBottom: (height * 2) / 100,
              }}
            >
              <TouchableOpacity onPress={whtsappHandlePress}>
                <Text style={{ alignSelf: "center" }}>
                  <FontAwesome
                    size={(height * 4) / 100}
                    name="whatsapp"
                    color={"#25D366"}
                  />
                </Text>
                <Text variant="labelLarge" style={{ color: "#424242" }}>
                  WhatsApp
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={smsHandlePress}>
                <Text style={{ alignSelf: "center" }}>
                  <FontAwesome5
                    name="sms"
                    size={(height * 4) / 100}
                    color={"#ffd600"}
                  />
                </Text>
                <Text variant="labelLarge" style={{ color: "#424242" }}>
                  Messaging
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal>
      </Provider>
    </>
  );
};

export default ShareLink;
