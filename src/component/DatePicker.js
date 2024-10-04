import React, { useState } from "react";
import { View, Platform, TouchableOpacity, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";

const { height } = Dimensions.get("screen");

function DatePicker({
  date,
  setDate,
  text,
  showFlag = false,
  dateFormat = "dd-MM-yyyy",
}) {
  const [datePicker, setDatePicker] = useState(false);
  const [flag, setFlag] = useState(showFlag);

  function showDatePicker() {
    setDatePicker(true);
  }

  function onDateSelected(event, value) {
    setDatePicker(false);
    setDate(value);
    setFlag(true);
  }

  return (
    <View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          paddingHorizontal: 8,
          paddingVertical: 5,
          borderRadius: 3,
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity
          onPress={showDatePicker}
          style={{ alignSelf: "center" }}
        >
          <Text variant="bodyLarge" style={{ color: "black" }}>
            {/* {flag ? `0${day}-0${month}-${year}` : text} */}
            {flag && format(new Date(date), dateFormat)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={showDatePicker}
          style={{ alignSelf: "center" }}
        >
          <MaterialIcons
            name="date-range"
            size={16}
            style={{
              paddingLeft: 7,
              // paddingTop: (height * 0.5) / 100,
              alignSelf: "center",
            }}
          />
        </TouchableOpacity>
      </View>

      {datePicker && (
        <DateTimePicker
          value={date}
          mode={"date"}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          is24Hour={true}
          onChange={onDateSelected}
        />
      )}
    </View>
  );
}

export default DatePicker;
