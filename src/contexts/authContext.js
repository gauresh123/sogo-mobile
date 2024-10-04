import { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import {
  registerForPushNotificationsAsync,
  removeDeviceToken,
  setDeviceToken,
} from "../services/notifications";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [connected, setConnected] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [routeName, setRouteName] = useState("");

  const handleUserAttributeChange = (key, value) => {
    setUser((prev) => {
      const obj = {
        ...prev,
        [key]: value,
      };
      AsyncStorage.setItem("user", JSON.stringify(obj));
      return obj;
    });
  };

  const handleRegisterToken = async (user) => {
    await registerForPushNotificationsAsync().then(async (token) => {
      if (!token) return;
      if (user.deviceToken === token) return;
      const { data, error } = await setDeviceToken(user.userId, token);
      if (data) handleUserAttributeChange("deviceToken", data[0].devicetoken);
    });
  };

  useEffect(() => {
    const getUser = async () => {
      const user = await JSON.parse(await AsyncStorage.getItem("user"));
      setUser(user);
      return user;
    };
    getUser().then(async (user) => {
      setInitialLoadComplete(true);
      if (user?.userId) {
        handleRegisterToken(user);
      }
    });
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const isLoggedIn = () => {
    return user?.userId ? true : false;
  };

  const loginUser = (data) => {
    const nUser = {
      userId: data.userid,
      role: data.rolename,
      subrole: data.subrole,
      userName: data.name,
      mobileNo: data.mobileno,
      city: data.city,
      distributorName: data.parentname,
      distributorId: data.parentid,
    };
    setUser(nUser);
    AsyncStorage.setItem("user", JSON.stringify(nUser));
    handleRegisterToken(nUser);
    return true;
  };

  const logoutUser = async () => {
    if (user.deviceToken) await removeDeviceToken(user.deviceToken);
    setUser();
    await AsyncStorage.multiRemove(["user"])
      .then(() => true)
      .catch(() => false);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loginUser,
        logoutUser,
        connected,
        routeName,
        setRouteName,
        handleUserAttributeChange,
      }}
    >
      {initialLoadComplete && children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
export const useAuthContext = () => useContext(AuthContext);
