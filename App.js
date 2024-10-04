import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import AuthContextProvider from "./src/contexts/authContext";
import Routes from "./Routes";
import OfflineProtected from "./src/component/OfflineProtected";
import CartContextProvider from "./src/contexts/CartContext";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import SearchContextProvider from "./src/contexts/SearchContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [notification, setNotification] = useState();
  const notificationListener = useRef();

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
    };
  }, []);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <PaperProvider theme={DefaultTheme}>
        <AuthContextProvider>
          <OfflineProtected>
            <CartContextProvider>
              <SearchContextProvider>
                <Routes />
              </SearchContextProvider>
            </CartContextProvider>
          </OfflineProtected>
        </AuthContextProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
