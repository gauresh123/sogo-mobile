import React from "react";
import { flushSync } from "react-dom";
import { Dimensions, Text, TouchableOpacity } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const { height } = Dimensions.get("screen");

const MultiSelect = ({
  selectedList,
  setSelectedList,
  data,
  showAll = true,
  valueField = "value",
  labelField = "label",
}) => {
  const theme = useTheme();

  const styles = {
    textStyles: {
      paddingBottom: (height * 1) / 100,
      paddingTop: (height * 2) / 100,
    },
  };

  const handleAllPress = () => {
    if (selectedList.length === data.length) {
      setSelectedList([]);
      return;
    }
    setSelectedList(data.map((item) => item[valueField]));
  };

  const handlePress = (item) => {
    if (selectedList.includes(item)) {
      flushSync(() => {
        setSelectedList(selectedList.filter((val) => val !== item));
        return;
      });
    } else {
      flushSync(() => {
        setSelectedList([...selectedList, item]);
      });
    }
  };

  return (
    <>
      <KeyboardAwareScrollView
        nestedScrollEnabled={true}
        style={{ maxHeight: height * (40 / 100) }}
      >
        {showAll && (
          <TouchableOpacity
            onPress={handleAllPress}
            style={{ marginLeft: "6%" }}
          >
            <Text
              style={{
                color:
                  selectedList.length === data.length ? "#674fa3" : "black",
                ...styles.textStyles,
              }}
            >
              {selectedList.length === data.length ? (
                <Ionicons name="checkbox-sharp" size={15} />
              ) : (
                <Fontisto name="checkbox-passive" size={12} />
              )}
              {"  "}
              All
            </Text>
          </TouchableOpacity>
        )}
        {data.map((item, index) => {
          const isSelected = selectedList.includes(item[valueField]);
          return (
            <TouchableOpacity
              onPress={() => handlePress(item[valueField])}
              style={{ marginLeft: "6%" }}
              key={index}
            >
              <Text
                style={{
                  color: isSelected ? "#674fa3" : "black",
                  ...styles.textStyles,
                }}
              >
                {isSelected ? (
                  <Ionicons name="checkbox-sharp" size={15} />
                ) : (
                  <Fontisto name="checkbox-passive" size={12} />
                )}
                {"  "}
                {item[labelField]}{" "}
              </Text>
            </TouchableOpacity>
          );
        })}
      </KeyboardAwareScrollView>
    </>
  );
};

export default MultiSelect;
