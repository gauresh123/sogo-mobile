import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { useSearchContext } from "../contexts/SearchContext";

const { width } = Dimensions.get("screen");

export default function SearchBox({ customWidth, placeHolder }) {
  const { setSearch, search } = useSearchContext();

  return (
    <View style={{ justifyContent: "center" }}>
      <TextInput
        style={{
          width: customWidth ? (width * 96) / 100 : (width * 80) / 100,
          height: 40,
          borderWidth: 1,
          borderColor: "gray",
          borderRadius: 10,
          paddingLeft: customWidth ? 50 : 40,
          paddingRight: 40,
          marginHorizontal: !customWidth ? 5 : null,
          marginLeft: customWidth ? -5 : null,
          backgroundColor: "#fffbff",
        }}
        mode="outlined"
        placeholder={placeHolder}
        value={search}
        onChangeText={(val) => setSearch(val)}
      />
      {search.length > 0 && (
        <TouchableOpacity
          style={{ position: "absolute", right: 10 }}
          onPress={() => setSearch("")}
        >
          <Entypo name="circle-with-cross" size={20} />
        </TouchableOpacity>
      )}
      <AntDesign
        name="search1"
        style={{ position: "absolute", left: customWidth ? 10 : 15 }}
        size={20}
        color={"gray"}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
