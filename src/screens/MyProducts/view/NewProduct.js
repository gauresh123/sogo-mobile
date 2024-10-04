import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import {
  TextInput,
  Text,
  Button,
  useTheme,
  HelperText,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import useProductCategories from "../../../hooks/useProductCategories";
import { useAuthContext } from "../../../contexts/authContext";
import Popup from "../../../component/Popup";
import { addProduct } from "../helper/productHelpers";
import { pickImage, IMGBBuploadImage } from "../helper/imageHelper";
import { GstRates } from "../../../constants/gstRates";
import CheckBox from "../../../component/Checkbox";

const { height, width } = Dimensions.get("screen");

const checkBoxStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
};

export function validatePriceFormat(priceString) {
  const pattern = /^(0|[1-9]\d*)(\.\d{0,2})?$/;
  return pattern.test(priceString) || !priceString;
}

const NewProduct = () => {
  const { user } = useAuthContext();
  const theme = useTheme();
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [showGstPopup, setShowGstPopup] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const [productName, setProductName] = useState("");
  const [mrp, setMrp] = useState(0);
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState({
    categoryid: "",
    categoryname: "",
  });
  const [gst, setGst] = useState({
    value: 0,
    name: "",
  });
  const [image, setImage] = useState(null);
  const { productCategories } = useProductCategories();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handlePickImage = async () => {
    try {
      const { uri } = await pickImage(750, 1000);
      setImage(uri);
    } catch (error) {
      Alert.alert("Error", "There was an error");
    }
  };

  const reset = () => {
    setProductName("");
    setMrp(0);
    setPrice(0);
    setCategory({
      categoryid: "",
      categoryname: "",
    });
    setImage(null);
    setIsSubscribed(false);
  };

  const validateInput = () => {
    const temp = {};
    if (!productName) temp.productName = "Product Name is required";
    if (!mrp > 0) temp.mrp = "MRP is required";
    if (!price > 0) temp.price = "Price is required";
    if (!category.categoryid) temp.category = "Category is required";

    setErrors(temp);

    return !Object.keys(temp).length > 0;
  };

  const handleAddProduct = async () => {
    setUploading(true);
    try {
      if (!validateInput()) return;
      let imageUrl = "";
      if (image) {
        const { url, error: imageError } = await IMGBBuploadImage(image);
        if (imageError) {
          Alert.alert("Error", "There was an error");
          return;
        }
        imageUrl = url;
      }
      const { data: response, error } = await addProduct(
        productName,
        category.categoryid,
        user.distributorId,
        price,
        mrp,
        imageUrl,
        gst.value,
        isSubscribed
      );
      if (error) {
        Alert.alert("Error", error);
        return;
      }
      reset();
      Alert.alert("Success", "Product added!");
    } catch (error) {
      Alert.alert("Error", "There was an error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ width: "100%", marginTop: (height * 3) / 100 }}>
          <TextInput
            mode="outlined"
            label={"Product Name"}
            style={styles.input}
            placeholder="Product Name"
            onChangeText={(text) => setProductName(text)}
            value={productName}
            placeholderTextColor={"gray"}
          />
          <HelperText visible={errors.productName} type={"error"}>
            {errors.productName}{" "}
          </HelperText>
        </View>
        <View style={{ width: "100%" }}>
          <TextInput
            mode="outlined"
            label={"Price"}
            style={styles.input}
            keyboardType={"decimal-pad"}
            onChangeText={(text) => {
              if (text.includes("-")) {
                setPrice("");
                return;
              }
              if (!validatePriceFormat(text)) return;
              setPrice(text);
            }}
            value={price}
            placeholder="Price Per Unit"
            placeholderTextColor={"gray"}
          />
          <HelperText visible={errors.price} type={"error"}>
            {errors.price}{" "}
          </HelperText>
        </View>
        <View style={{ width: "100%" }}>
          <TextInput
            mode="outlined"
            label={"MRP"}
            style={styles.input}
            keyboardType={"decimal-pad"}
            onChangeText={(text) => {
              if (text.includes("-")) {
                setMrp("");
                return;
              }
              if (!validatePriceFormat(text)) return;
              setMrp(text);
            }}
            value={mrp}
            placeholder="MRP Per Unit"
            placeholderTextColor={"gray"}
          />
          <HelperText visible={errors.mrp} type={"error"}>
            {errors.mrp}{" "}
          </HelperText>
        </View>

        <View style={{ width: "100%" }}>
          <TouchableOpacity onPress={() => setShowGstPopup(true)}>
            <View
              style={{
                width: "100%",
                backgroundColor: theme.colors.background,
                borderColor: "gray",
                borderWidth: 1,
                padding: "3.5%",
                borderRadius: 5,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: (height * 1.6) / 100,
                }}
              >
                {gst?.name || "GST@0%(nil-rated)"}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={23} color="gray" />
            </View>
            <HelperText visible={errors.gst} type={"error"}>
              {errors.gst}{" "}
            </HelperText>
          </TouchableOpacity>
        </View>

        <Text
          variant="labelLarge"
          style={{
            color: "gray",
          }}
        >
          Category:
        </Text>
        <View style={{ width: "100%" }}>
          <TouchableOpacity onPress={() => setShowCategoryPopup(true)}>
            <View
              style={{
                width: "100%",
                backgroundColor: theme.colors.background,
                borderColor: "gray",
                borderWidth: 1,
                padding: "3.5%",
                borderRadius: 5,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: (height * 1.6) / 100,
                }}
              >
                {category?.categoryname || "Select Category"}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={23} color="gray" />
            </View>
            <HelperText visible={errors.category} type={"error"}>
              {errors.category}{" "}
            </HelperText>
          </TouchableOpacity>
        </View>
        <View style={{ width: "100%" }}>
          <CheckBox
            value={isSubscribed}
            toggle={() => setIsSubscribed(!isSubscribed)}
            label={"Subscription Opt-In"}
            style={checkBoxStyle}
          />
        </View>
        <View
          style={{
            marginTop: (height * 3) / 100,
            alignItems: "center",
            width: "100%",
          }}
        >
          {image && (
            <Image
              source={{ uri: image }}
              style={{
                width: (width * 15) / 100,
                height: (height * 10) / 100,
                marginLeft: (width * 2) / 100,
                marginBottom: 10,
              }}
            />
          )}
          <View style={{ alignSelf: "center" }}>
            <Button mode="contained" onPress={!uploading && handlePickImage}>
              {image ? "Choose New" : "Upload Image"}
            </Button>
          </View>
        </View>
        <Button
          style={{
            alignSelf: "center",
            width: "100%",
            marginTop: (height * 3) / 100,
          }}
          loading={uploading}
          mode="contained"
          onPress={!uploading && handleAddProduct}
        >
          {uploading ? "" : "Add Product"}
        </Button>
      </ScrollView>
      <Popup
        visible={showCategoryPopup}
        onDismiss={() => setShowCategoryPopup(false)}
        onShow={() => setShowCategoryPopup(true)}
        value={category.categoryid}
        showSearch={productCategories.length > 7}
        searchPlaceholder="Search Category"
        onClick={(val) => setCategory(val)}
        labelField={"categoryname"}
        valueField="categoryid"
        data={productCategories.filter((item) => item.categoryname !== "All")}
      />
      <Popup
        visible={showGstPopup}
        onDismiss={() => setShowGstPopup(false)}
        onShow={() => setShowGstPopup(true)}
        data={GstRates}
        onClick={(val) => setGst(val)}
        value={gst}
        labelField={"name"}
        valueField="value"
        showSearch={GstRates.length > 7}
        searchPlaceholder="Search Rates"
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
  },
  input: {
    width: "100%",
    borderRadius: 10,
    elevation: 0,
  },
});
export default NewProduct;
