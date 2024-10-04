import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import mime from "mime";
import { IMGBB_API_KEY } from "../../../constants/constants";
import axios from "axios";

export const pickImage = async (maxWidth, maxHeight) => {
  try {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });
    if (res.cancelled) {
      return {};
    }
    // resize image if too large
    const resizedImage =
      res.height > maxHeight && res.width > maxWidth
        ? await ImageManipulator.manipulateAsync(
            res.uri,
            [{ resize: { width: maxWidth, height: maxHeight } }],
            { compress: 1 }
          )
        : res;

    return resizedImage;
  } catch (error) {
    if (error.message !== "canceled") throw new Error(error);
  }
};

export const IMGBBuploadImage = async (image) => {
  const newImageUri = "file:///" + image.split("file:/").join("");

  const formData = new FormData();
  formData.append("image", {
    uri: newImageUri,
    type: mime.getType(newImageUri),
    name: newImageUri.split("/").pop(),
  });
  formData.append("key", IMGBB_API_KEY);
  try {
    const { data } = await axios.post(
      "https://api.imgbb.com/1/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (!data) {
      return { error: "There was an error" };
    }
    return { url: data.data.url };
  } catch (error) {
    return { error: error.message };
  }
};
