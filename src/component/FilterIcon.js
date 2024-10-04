import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { useSearchContext } from "../contexts/SearchContext";
const { height, width } = Dimensions.get("screen");
const FilterIcon = () => {
  const { setShown } = useSearchContext();
  const filterHandlePress = () => {
    setShown(true);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.filtericon}>
      <TouchableOpacity onPress={filterHandlePress}>
        <AntDesign
          name="filter"
          size={25}
          color="#6a1b9a"
          style={{ alignSelf: "center" }}
        />
        <Text style={{ fontSize: (height * 1.3) / 100, color: "#6a1b9a" }}>
          Filters
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FilterIcon;

const styles = StyleSheet.create({
  filtericon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 7,
    marginRight: -(width * 3) / 100,
  },
});
