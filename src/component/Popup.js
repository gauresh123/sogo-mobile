import React, { useMemo, useState } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  FlatList,
} from "react-native";
import {
  Modal,
  Portal,
  Provider,
  TextInput,
  useTheme,
} from "react-native-paper";

const { height } = Dimensions.get("screen");
const { width } = Dimensions.get("screen");

const containerStyle = {
  backgroundColor: "#eeeeee",
  width: "90%",
  marginLeft: "5.5%",
  display: "flex",
  maxHeight: (height * 30) / 100,
  maxHeight: "80%",
  borderRadius: 10,
  alignContent: "center",
};

function Popup({
  visible,
  onDismiss,
  value,
  onClick,
  data,
  showSearch = false,
  searchPlaceholder = "Search",
  labelField = "value",
  valueField = "value",
}) {
  const theme = useTheme();
  const [search, setSearch] = useState("");

  const handleClick = (val) => {
    onClick(val);
    onDismiss();
  };

  const filterdata = useMemo(() => {
    return data.filter((val) => {
      return val[labelField]?.toLowerCase()?.includes(search.toLowerCase());
    });
  }, [search, data]);

  const renderData = ({ item }) => {
    let style = {};
    if (value === item[valueField]) {
      style = { color: theme.colors.primary };
    }
    return (
      <View style={{ marginLeft: (width * 4) / 100 }}>
        <TouchableOpacity
          onPress={() => handleClick(item)}
          style={{
            paddingBottom: (height * 2) / 100,
            paddingTop: (height * 2) / 100,
          }}
        >
          <Text
            variant="titleMedium"
            style={{
              fontSize: (height * 1.7) / 100,
              fontWeight: "500",
              ...style,
            }}
          >
            {item[labelField]}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <Provider>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={() => onDismiss()}
            contentContainerStyle={containerStyle}
          >
            {showSearch && (
              <TextInput
                style={{
                  width: "100%",
                  height: (height * 6) / 100,
                  marginBottom: (height * 1.6) / 100,
                }}
                onChangeText={(val) => setSearch(val)}
                placeholder={searchPlaceholder}
              />
            )}
            <FlatList
              data={filterdata}
              renderItem={renderData}
              keyboardShouldPersistTaps={"handled"}
              keyExtractor={(item, index) => index}
            />
          </Modal>
        </Portal>
      </Provider>
    </>
  );
}

export default Popup;
