import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const AddNewProductIcon = ({ screenName }) => {
  const navigation = useNavigation();

  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate(screenName)}>
        <Text>
          <AntDesign name="plus" size={25} />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddNewProductIcon;
