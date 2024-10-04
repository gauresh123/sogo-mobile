import React, { useMemo } from "react";
import { Modal, Portal, Provider, Button, Text } from "react-native-paper";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import DatePicker from "../../../component/DatePicker";
import DropdownContainer from "../../../component/DropdownContainer";
import SingleSelect from "../../../component/SingleSelect";
import MultiSelect from "../../../component/MultiSelect";

const { height } = Dimensions.get("screen");

function OrderReportFilters({
  shown,
  setShown,
  cities,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  selectedCity,
  setSelectedCity,
  statuses,
  selectedList,
  setSelectedList,
}) {
  return (
    <Provider>
      <Portal>
        <Modal
          visible={shown}
          onDismiss={() => setShown(false)}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={{ maxHeight: (height * 70) / 100 }}>
            <ScrollView nestedScrollEnabled={true}>
              {cities.length > 2 && (
                <DropdownContainer header="Select City">
                  <View style={{ maxHeight: (height * 30) / 100 }}>
                    <SingleSelect
                      data={cities}
                      setValue={setSelectedCity}
                      labelField={"value"}
                      searchPlaceholder="Search city"
                      showSearch={cities.length > 7}
                      value={selectedCity}
                    />
                  </View>
                </DropdownContainer>
              )}
              <DropdownContainer header={"Select Date"}>
                <View style={styles.datecontainer}>
                  <Text variant="titleMedium" style={styles.dateLabel}>
                    From :{" "}
                  </Text>
                  {useMemo(
                    () => (
                      <DatePicker
                        date={fromDate}
                        setDate={setFromDate}
                        text={"From"}
                        showFlag={true}
                      />
                    ),
                    [fromDate]
                  )}

                  <Text variant="titleMedium" style={styles.dateLabel}>
                    To :{" "}
                  </Text>
                  {useMemo(
                    () => (
                      <DatePicker
                        date={toDate}
                        setDate={setToDate}
                        text={"To"}
                        showFlag={true}
                      />
                    ),
                    [toDate]
                  )}
                </View>
              </DropdownContainer>
              <DropdownContainer header={"Select Status"}>
                <MultiSelect
                  selectedList={selectedList}
                  setSelectedList={setSelectedList}
                  data={statuses}
                  labelField="value"
                />
              </DropdownContainer>
              <Button
                mode="contained"
                style={styles.button}
                onPress={() => setShown(false)}
              >
                View Result
              </Button>
            </ScrollView>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
}

export default OrderReportFilters;

const styles = StyleSheet.create({
  contentContainer: {
    display: "flex",
    backgroundColor: "white",
    minHeight: (height * 20) / 100,
    width: "95%",
    justifyContent: "center",
    marginLeft: "3%",
    borderRadius: 10,
  },
  dateLabel: {
    textAlignVertical: "center",
    fontSize: (height * 1.5) / 100,
    color: "black",
  },
  datecontainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "3%",
    backgroundColor: "#f5f5f5",
  },
  button: {
    borderRadius: 5,
    width: "95%",
    marginLeft: "3%",
    marginTop: "5%",
    marginBottom: "2%",
  },
});
