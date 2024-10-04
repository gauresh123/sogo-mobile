import axiosInstance from "../../../../axiosInstance";
import * as Location from "expo-location";

export const getLocation = async (timeout = 3000) => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Please grant Location");
    return;
  }
  const locationPromise = Location.getCurrentPositionAsync({
    enableHighAccuracy: true,
    accuracy: Location.Accuracy.High,
    timeInterval: 1000,
    distanceInterval: 1,
  });
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Took too long to get location. Try again."));
    }, timeout);
  });

  try {
    const location = await Promise.race([locationPromise, timeoutPromise]);
    return location;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getRetailers = async (distributorId, city) => {
  try {
    const { data } = await axiosInstance.get(
      `/retailer/${distributorId}/${city}`
    );
    return { data: data.data, message: data.message };
  } catch (err) {
    return { error: err.message };
  }
};

export const getDistributorCities = async (distributorId) => {
  return axiosInstance
    .get(`/retailer/cities/${distributorId}`)
    .then((res) => {
      res.data.data = res.data.data.map((city, idx) => {
        return { key: idx, value: city.city };
      });
      return {
        data: [{ key: res.data.data.length, value: "All" }, ...res.data.data],
      };
    })
    .catch((err) => {
      return { error: err.message };
    });
};

export const addSaleCheckin = async (
  distributorId,
  retailerId,
  location,
  orderPlaced,
  reason,
  comment,
  userId
) => {
  return axiosInstance
    .post(`/distributor/${distributorId}/addSaleCheckin`, {
      userId,
      retailerId,
      location: location.coords,
      orderPlaced,
      reason,
      comment,
    })
    .then((res) => {
      return { data: res.data.data };
    })
    .catch((error) => {
      return { error: error.message };
    });
};
