import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import OrderReport from "../screens/orderreport/view/OrderReport";
import HomeNavigator from "./navigators/HomeNavigator";
import OrdersNavigator from "./navigators/OrdersNavigator";
import MenuNavigator from "./navigators/MenuNavigator";
import { useTheme } from "react-native-paper";
import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import SubscriptionNavigator from "./navigators/SubscriptionNavigator";

const Tab = createBottomTabNavigator();

export default function BottomNav({ navigation }) {
  const theme = useTheme();
  const responseListener = useRef();

  useEffect(() => {
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const { title } = response.notification.request.content;
        if (title?.toLowerCase().includes("new order")) {
          navigation.navigate("Orders");
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const defaultTabOptions = {
    tabBarHideOnKeyboard: true,
    tabBarActiveTintColor: theme.colors.primary,
  };

  return (
    <Tab.Navigator>
      <Tab.Screen
        name={"Home"}
        component={HomeNavigator}
        options={{
          tabBarIcon: (props) => <BottomIconContainer name="home" {...props} />,
          ...defaultTabOptions,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersNavigator}
        options={{
          tabBarIcon: (props) => <BottomIconContainer name="book" {...props} />,
          ...defaultTabOptions,
          title: "My Orders",
          headerShown: false,
          headerTitleStyle: { marginLeft: "3%" },
        }}
      />
      <Tab.Screen
        name="Subscriptions"
        component={SubscriptionNavigator}
        options={{
          tabBarIcon: (props) => (
            <BottomIconContainer name="bells" {...props} />
          ),
          ...defaultTabOptions,
          title: "Subscriptions",
          headerShown: false,
          headerTitleStyle: { marginLeft: "3%" },
        }}
      />
      <Tab.Screen
        name="Order Report"
        component={OrderReport}
        options={{
          tabBarIcon: (props) => (
            <BottomIconContainer name="filetext1" {...props} />
          ),
          ...defaultTabOptions,
          title: "Order Report",
          headerTitleStyle: { marginLeft: "3%" },
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuNavigator}
        options={{
          tabBarIcon: (props) => (
            <BottomIconContainer name="menufold" {...props} />
          ),
          ...defaultTabOptions,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

const BottomIconContainer = ({ name, focused, color = "black" }) => {
  const theme = useTheme();
  return (
    <AntDesign
      name={name}
      size={25}
      color={focused ? theme.colors.primary : "black"}
    />
  );
};
