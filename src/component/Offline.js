import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

function Offline() {
  return (
    <View style={styles.container}>
      <Text style={styles.head}>You're offline!</Text>
      <Text>Connect to internet to perform transactions</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  head: {
    fontWeight: "600",
    fontSize: 18,
  },
});

export default Offline;
