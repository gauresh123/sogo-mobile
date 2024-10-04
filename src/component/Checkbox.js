import { View, Dimensions } from "react-native";
import React from "react";
import { Checkbox, Text } from "react-native-paper";

const CheckBox = ({ value, toggle, style, label }) => {
  return (
    <View style={style}>
      <Text style={{ fontWeight: "600" }} variant="titleMedium">
        {label}
      </Text>
      <Checkbox status={value ? "checked" : "unchecked"} onPress={toggle} />
    </View>
  );
};

export default CheckBox;
