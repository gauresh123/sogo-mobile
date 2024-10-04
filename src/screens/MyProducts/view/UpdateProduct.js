import React, { useState, useEffect } from "react";
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
import Popup from "../../../component/Popup";
import { updateProduct } from "../helper/productHelpers";
import { pickImage, IMGBBuploadImage } from "../helper/imageHelper";
import axiosInstance from "../../../../axiosInstance";
import { validatePriceFormat } from "./NewProduct";
import { GstRates } from "../../../constants/gstRates";
import CheckBox from "../../../component/Checkbox";

const { height, width } = Dimensions.get("screen");
const checkBoxStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
};

const UpdateProduct = ({ route, navigation }) => {
  const theme = useTheme();
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const [productName, setProductName] = useState("");
  const [mrp, setMrp] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState({
    categoryid: "",
    categoryname: "",
  });
  const [image, setImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [showGstPopup, setShowGstPopup] = useState(false);
  const [gst, setGst] = useState({
    value: 0,
    name: "",
  });
  const { productCategories } = useProductCategories();
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const {
          data: { data },
        } = await axiosInstance.get(`/product/${route.params.productId}`);

        setProductName(data.productname);
        setPrice(Number(data.price).toFixed(2));
        setCategory({
          categoryid: data.categoryid,
          categoryname: data.categoryname,
        });
        setMrp(Number(data.mrp).toFixed(2));
        setImage(data.productimage);
        setGst({
          value: data.gstrate,
          name: GstRates.find((rate) => rate.value == data.gstrate)?.name,
        });
        setIsSubscribed(data.subscriptionenabled);
      } catch (error) {
        Alert.alert("Error", "There was an error");
      }
    };

    fetchProductDetails();
  }, [route.params.productId]);

  const handlePickImage = async () => {
    try {
      const { uri } = await pickImage(750, 1000);
      setNewImage(uri);
    } catch (error) {
      Alert.alert("Error", "There was an error");
    }
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

  const handleUpdateProduct = async () => {
    setUploading(true);
    try {
      if (!validateInput()) return;
      let imageUrl = image;
      if (newImage) {
        const { url, error: imageError } = await IMGBBuploadImage(newImage);
        if (imageError) {
          Alert.alert("Error", "There was an error");
          return;
        }
        imageUrl = url;
      }
      const { data: response, error } = await updateProduct(
        route.params.productId,
        productName,
        Number(price).toFixed(2),
        Number(mrp).toFixed(2),
        category.categoryid,
        imageUrl,
        gst.value,
        isSubscribed
      );
      if (error) {
        Alert.alert("Error", error);
        return;
      }
      Alert.alert("Success", "Product updated!");
      navigation.navigate("MyProducts");
    } catch (error) {
      Alert.alert("Error", error.message);
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
            value={price.toString()}
            placeholder="Price Per Unit"
            placeholderTextColor={"gray"}
          />
          <HelperText visible={errors.price} type={"error"}>
            {errors.price}{" "}
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

        <View style={{ width: "100%" }}>
          <TextInput
            mode="outlined"
            label={"MRP"}
            style={styles.input}
            keyboardType={"number-pad"}
            onChangeText={(text) => {
              if (text.includes("-")) {
                setMrp("");
                return;
              }
              if (!validatePriceFormat(text)) return;
              setMrp(text);
            }}
            value={mrp.toString()}
            placeholder="MRP Per Unit"
            placeholderTextColor={"gray"}
          />
          <HelperText visible={errors.mrp} type={"error"}>
            {errors.mrp}{" "}
          </HelperText>
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
          {(image || newImage) && (
            <Image
              source={{ uri: newImage || image }}
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
          loading={uploading}
          style={{
            alignSelf: "center",
            width: "100%",
            marginTop: (height * 3) / 100,
          }}
          mode="contained"
          onPress={!uploading && handleUpdateProduct}
        >
          {uploading ? "Updating..." : "Update Product"}
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
        value={gst.value}
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
export default UpdateProduct;
