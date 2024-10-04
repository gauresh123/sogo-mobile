import React from "react";
import { View, Dimensions } from "react-native";
import { DataTable, Text, useTheme } from "react-native-paper";
const { height } = Dimensions.get("screen");
const { width } = Dimensions.get("screen");

function Table({ products }) {
  const theme = useTheme();
  return (
    <View>
      <DataTable>
        <View style={{ backgroundColor: theme.colors.primaryContainer }}>
          <DataTable.Header>
            <DataTable.Title>
              <Text
                style={{
                  color: "black",
                  fontWeight: "500",
                  fontSize: (height * 1.5) / 100,
                }}
              >
                Item Name
              </Text>
            </DataTable.Title>
            <DataTable.Title numeric>
              <Text
                style={{
                  color: "black",
                  fontWeight: "500",
                  fontSize: (height * 1.2) / 100,
                }}
              >
                Qty
              </Text>
            </DataTable.Title>
          </DataTable.Header>
        </View>
        {products?.map((val, i) => {
          return (
            <View
              key={i}
              style={{
                backgroundColor: "#fafafa",
                borderWidth: 0.5,
                borderColor: "silver",
              }}
            >
              <DataTable.Row key={i}>
                <DataTable.Cell style={{ flex: 3 }}>
                  {val.productname}
                </DataTable.Cell>
                <DataTable.Cell numeric>{val.productquantity}</DataTable.Cell>
              </DataTable.Row>
            </View>
          );
        })}
      </DataTable>
    </View>
  );
}

export default Table;
