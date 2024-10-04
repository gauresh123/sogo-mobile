import React, { useMemo } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Provider, Text } from "react-native-paper";
import DatePicker from "../../../component/DatePicker";
import DropdownContainer from "../../../component/DropdownContainer";
import SingleSelect from "../../../component/SingleSelect";
import statuses from "../../../constants/statusOptions";
import paymentStatuses from "../../../constants/PaymentStatus";

const { height } = Dimensions.get("screen");

const containerStyle = {
  backgroundColor: "#fafafa",
  width: "100%",
  minHeight: (height * 20) / 100,
  position: "absolute",
  bottom: 0,
  paddingTop: 0,
};

function OrderFilters({
  shown,
  cities,
  selectedCity,
  setSelectedCity,
  status,
  setStatus,
  fromDate,
  setFromDate,
  endDate,
  setEndDate,
  setShown,
  paymentStatus,
  setPaymentStatus,
}) {
  return (
    <Provider>
      <Portal>
        <Modal
          visible={shown}
          onDismiss={() => setShown(false)}
          contentContainerStyle={containerStyle}
        >
          <View style={{ maxHeight: (height * 90) / 100 }}>
            <ScrollView nestedScrollEnabled={true}>
              {cities.length > 2 && (
                <DropdownContainer header={"Select City"}>
                  <View style={{ maxHeight: (height * 30) / 100 }}>
                    <SingleSelect
                      data={cities}
                      setValue={setSelectedCity}
                      labelField={"value"}
                      searchPlaceholder="Search city"
                      showSearch={cities.length > 8}
                      value={selectedCity}
                    />
                  </View>
                </DropdownContainer>
              )}
              <DropdownContainer header="Select Date">
                <View style={styles.datecontainer}>
                  <Text
                    variant="titleMedium"
                    style={{
                      textAlignVertical: "center",
                      fontSize: (height * 1.5) / 100,
                    }}
                  >
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

                  <Text
                    variant="titleMedium"
                    style={{
                      textAlignVertical: "center",
                      fontSize: (height * 1.5) / 100,
                    }}
                  >
                    To :{" "}
                  </Text>

                  {useMemo(
                    () => (
                      <DatePicker
                        date={endDate}
                        setDate={setEndDate}
                        text={"To"}
                        showFlag={true}
                      />
                    ),
                    [endDate]
                  )}
                </View>
              </DropdownContainer>
              <DropdownContainer header={"Select Status"}>
                <SingleSelect
                  data={statuses}
                  value={status}
                  setValue={setStatus}
                  labelField={"value"}
                />
              </DropdownContainer>
              <DropdownContainer header={"Payment Status"}>
                <SingleSelect
                  data={paymentStatuses}
                  value={paymentStatus}
                  setValue={setPaymentStatus}
                />
              </DropdownContainer>
              <Button
                mode="contained"
                style={{
                  borderRadius: 5,
                  width: "95%",
                  marginLeft: "3%",
                  marginTop: "5%",
                  marginBottom: "2%",
                }}
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

export default OrderFilters;

const styles = StyleSheet.create({
  datecontainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "3%",
    backgroundColor: "#f5f5f5",
  },
});
