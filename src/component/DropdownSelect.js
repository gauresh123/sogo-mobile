import React from "react";
import { View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

function DropdownSelect({ options, setValue, placeholder, ...other }) {
  return (
    <View>
      <SelectList
        setSelected={(val) => setValue(val)}
        data={options}
        placeholder={placeholder}
        save="value"
        boxStyles={{
          backgroundColor: "#fafafa",
          borderWidth: 0,
          borderRadius: 3,
          position: "relative",
        }}
        inputStyles={{
          minWidth: 200,
        }}
        dropdownStyles={{
          minWidth: 200,
          backgroundColor: "fafafa",
        }}
        dropdownItemStyles={{
          minWidth: 200,
        }}
        {...other}
      />
    </View>
  );
}

export default DropdownSelect;
