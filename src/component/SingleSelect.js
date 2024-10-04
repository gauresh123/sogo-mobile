import React, { useCallback, useState, useMemo } from "react";
import { Dimensions, View, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Text, TextInput, useTheme } from "react-native-paper";

const { height } = Dimensions.get("screen");

function SingleSelect({
  data,
  value,
  setValue,
  showSearch = false,
  header = "",
  key,
  labelField = "label",
  valueField = "value",
  searchPlaceholder = "Search",
  itemStyles = {},
  textStyles = {},
  selectedItemStyles = {},
  headerContainerStyles = {},
  headerStyles = {},
}) {
  const theme = useTheme();
  const [searchText, setSearchText] = useState("");

  const styles = {
    textStyles: {
      paddingBottom: (height * 2) / 100,
      paddingTop: (height * 1) / 100,
      color: "black",
      ...textStyles,
    },
  };

  const renderItem = useCallback(
    (item, i) => {
      const style =
        value === item[valueField]
          ? {
              ...styles.textStyles,
              ...selectedItemStyles,
              color: "#674fa3",
            }
          : styles.textStyles;
      return (
        <TouchableOpacity
          onPress={() => setValue(item[valueField])}
          key={item[key] || i}
          style={{ marginLeft: "6%", ...itemStyles }}
        >
          <Text style={style}>{item[labelField]}</Text>
        </TouchableOpacity>
      );
    },
    [value]
  );

  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        searchText === "" ||
        item[valueField].toLowerCase().includes(searchText.toLowerCase())
    );
  }, [data, searchText]);

  return (
    <>
      {header && (
        <View
          style={{
            padding: "3%",
            backgroundColor: theme.colors.secondaryContainer,
            borderRadius: 10,
            ...headerContainerStyles,
          }}
        >
          <Text
            style={{
              fontWeight: "600",
              fontSize: (height * 1.8) / 100,
              ...headerStyles,
            }}
          >
            {header}
          </Text>
        </View>
      )}
      {showSearch && (
        <TextInput
          style={{
            width: "94%",
            height: (height * 5) / 100,
            backgroundColor: "white",
            marginLeft: "3%",
            borderWidth: 1,
            borderRadius: 8,
            marginTop: "2%",
            marginBottom: "1%",
          }}
          placeholder={searchPlaceholder}
          onChangeText={(val) => setSearchText(val)}
          underlineColor={"white"}
        />
      )}
      <KeyboardAwareScrollView nestedScrollEnabled={true}>
        {filteredData.map((item, i) => renderItem(item, i))}
      </KeyboardAwareScrollView>
    </>
  );
}

export default SingleSelect;
