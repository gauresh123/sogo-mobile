import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";

function DropdownContainer({
  header,
  children,
  headerStyles = {},
  headerContainerStyles = {},
  containerStyles = {},
}) {
  const styles = useStyles();
  const [open, setOpen] = useState(false);

  const handleToggleOpen = () => {
    setOpen(!open);
  };
  return (
    <>
      <TouchableOpacity
        style={{ ...styles.container, ...headerContainerStyles }}
        onPress={handleToggleOpen}
      >
        <Text style={{ ...styles.headerStyles, ...headerStyles }}>
          {header}
        </Text>
        <AntDesign name={open ? "up" : "down"} size={17} color="gray" />
      </TouchableOpacity>
      <View style={{ backgroundColor: "rgb(240,240,240)", ...containerStyles }}>
        {open && children}
      </View>
    </>
  );
}

export default DropdownContainer;

const useStyles = () => {
  const styles = {
    container: {
      padding: "4%",
      borderBottomColor: "silver",
      borderBottomWidth: 1,
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "row",
      width: "100%",
      backgroundColor: "white",
    },
    headerStyles: {
      color: "black",
    },
  };
  return styles;
};
