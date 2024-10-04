import axiosInstance from "../../axiosInstance";
import * as Device from "expo-device";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

export const setDeviceToken = async (userId, token) => {
  try {
    const {
      data: { data },
    } = await axiosInstance.post(`/user/${userId}/token`, {
      token,
    });
    return { data: data };
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export const removeDeviceToken = async (token) => {
  try {
    const {
      data: { data },
    } = await axiosInstance.delete(`/user/${token}/token`, {
      token,
    });
    return { data: data };
  } catch (error) {
    return { error: error.response?.data?.message || error.message };
  }
};

export async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Permission is required to receive notifications on your device");
      return;
    }
    token = (await Notifications.getDevicePushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
