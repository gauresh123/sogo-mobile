import React, { useEffect, useState } from "react";
import {
  Dimensions,
  View,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { Modal, Portal, Provider, Text } from "react-native-paper";

const { height } = Dimensions.get("screen");
const Options = ({
  visible,
  onDismiss,
  showShare,
  subscriptionOrder,
  subscriptionenabled,
}) => {
  return (
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
            height: "auto",
            borderRadius: 10,
          }}
        >
          <View style={{ padding: (height * 2) / 100 }}>
            <TouchableOpacity
              style={{
                marginBottom: subscriptionenabled ? (height * 2) / 100 : null,
              }}
              onPress={showShare}
            >
              <Text style={{ color: "black" }} variant="titleSmall">
                Share
              </Text>
            </TouchableOpacity>
            {subscriptionenabled && (
              <TouchableOpacity onPress={subscriptionOrder}>
                <Text style={{ color: "black" }} variant="titleSmall">
                  Subscription Order
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
};

export default Options;
