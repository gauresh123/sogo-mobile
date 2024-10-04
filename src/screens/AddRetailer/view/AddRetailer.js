import {
  Text,
  TextInput,
  HelperText,
  useTheme,
  Button,
} from "react-native-paper";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import useCities from "./../../../hooks/useCities";
import { useAuthContext } from "../../../contexts/authContext";
import { MaterialIcons } from "@expo/vector-icons";
import Popup from "../../../component/Popup";
import { addRetailerv3 } from "../helper/addRetailerHelper";
import CheckBox from "../../../component/Checkbox";
import HARD_CODED_USER_IDS from "../../../constants/edgeCaseUsers";
import MapExistingUserPopup from "./MapExistingUserPopup";

const { height } = Dimensions.get("screen");
const checkboxStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: (height * 1) / 100,
  marginBottom: (height * 1) / 100,
};

function AddRetailer({ navigation }) {
  const { user } = useAuthContext();

  const RETAILER_SCHEMA = {
    name: "",
    mobile: "",
    city: user.city,
  };

  const theme = useTheme();
  const { cities } = useCities();
  const [retailer, setRetailer] = useState(RETAILER_SCHEMA);
  const [loading, setLoading] = useState(false);
  const [showCityPopup, setShowCityPopup] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showMapUserPopup, setShowMapUserPopup] = useState(false);

  const handleRetailerAttributeChange = (key, value) => {
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setRetailer((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateInputs = () => {
    const temp = {};
    if (!retailer.name) temp.name = "User name is required";
    else if (retailer.name?.length < 3) temp.name = "User name is too short";
    if (!retailer.city) temp.city = "City is required";
    if (retailer.mobile?.length != 10)
      temp.mobile = "Please enter a valid mobile no";
    setErrors(temp);
    return !Object.values(temp).length > 0;
  };

  const reset = () => {
    setRetailer(RETAILER_SCHEMA);
    setIsSubscribed(false);
  };
  const handleAddRetailer = async () => {
    if (!validateInputs()) return;
    try {
      if (!user.distributorId) throw Error("There was an error");
      setLoading(true);
      const { error, data } = await addRetailerv3({
        firstName: retailer.name,
        mobile: retailer.mobile,
        city: retailer.city,
        distributorId: user.distributorId,
        subscriptionEnabled: isSubscribed,
      });
      if (error) {
        if (
          error === `User with mobile no already exists: ${retailer.mobile}`
        ) {
          setShowMapUserPopup(true);
          return;
        }
        Alert.alert("Error", error);
      } else {
        Alert.alert("Success", "New user added!");
        reset();
        navigation.navigate("LandingPage");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Input
          label={"Name"}
          value={"name"}
          handleChange={handleRetailerAttributeChange}
          errors={errors}
          retailer={retailer}
        />
        <Text style={styles.label} variant="titleMedium">
          City
        </Text>
        <View style={{ width: "100%" }}>
          <TouchableOpacity onPress={() => setShowCityPopup(true)}>
            <View
              style={{
                backgroundColor: theme.colors.background,
                borderColor: "gray",
                borderWidth: 1,
                padding: "3%",
                borderRadius: 5,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: (height * 1.9) / 100,
                }}
              >
                {retailer?.city || "Select City"}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={23} color="gray" />
            </View>
            {errors.city && (
              <HelperText visible={errors.category} type={"error"}>
                {errors.city}{" "}
              </HelperText>
            )}
          </TouchableOpacity>
        </View>
        <Input
          label={"Mobile no"}
          value={"mobile"}
          handleChange={(field, val) => {
            if (Number(val) || val === "" || val === "0") {
              handleRetailerAttributeChange("mobile", val?.substring(0, 10));
            }
          }}
          keyboardType={"numeric"}
          errors={errors}
          retailer={retailer}
        />
        <CheckBox
          value={isSubscribed}
          toggle={() => setIsSubscribed(!isSubscribed)}
          style={checkboxStyle}
          label={"Subscription Opt-In"}
        />
        <View
          style={{
            display: "flex",
            marginTop: 10,
            justifyContent: "flex-end",
            flexDirection: "row",
            width: "96%",
            marginHorizontal: "2%",
          }}
        >
          <Button
            onPress={
              !loading &&
              (() => {
                navigation.pop(1);
              })
            }
            style={{
              width: 100,
              marginBottom: 25,
            }}
          >
            Cancel
          </Button>
          <Button
            onPress={!loading && handleAddRetailer}
            mode="contained"
            loading={loading}
            style={{
              width: 100,
              marginBottom: 25,
            }}
          >
            Add
          </Button>
        </View>
      </ScrollView>

      <Popup
        visible={showCityPopup}
        onDismiss={() => setShowCityPopup(false)}
        value={retailer.city}
        data={
          HARD_CODED_USER_IDS.includes(user.distributorId)
            ? [{ city: user.city }]
            : cities.map((city) => ({ city: city }))
        }
        valueField={"city"}
        labelField={"city"}
        showSearch={cities.length > 7}
        onClick={(val) => handleRetailerAttributeChange("city", val.city)}
      />

      <MapExistingUserPopup
        shown={showMapUserPopup}
        onDismiss={() => setShowMapUserPopup(false)}
        mobileNo={retailer.mobile}
      />
    </>
  );
}

export default AddRetailer;

const Input = ({
  value,
  label,
  handleChange,
  errors,
  retailer,
  children,
  ...props
}) => (
  <>
    <Text style={styles.label} variant="titleMedium">
      {label}
    </Text>
    <TextInput
      mode="outlined"
      theme={{ roundness: 10 }}
      style={{
        elevation: 1,
        marginBottom: 5,
      }}
      value={retailer[value]}
      onChangeText={(val) => handleChange(value, val)}
      {...props}
    />
    {errors[value] && (
      <HelperText visible={errors[value]} type="error">
        {errors[value]}{" "}
      </HelperText>
    )}
    {children}
  </>
);

const styles = StyleSheet.create({
  label: {
    fontWeight: "600",
  },
  container: {
    width: "100%",
    paddingHorizontal: "2%",
    paddingVertical: "3%",
  },
});
