import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchBox from "../../component/SearchBox";
import { Dimensions, Text, View } from "react-native";
import SubscriptionDetails from "../../screens/SubscriptionDetails/view/SubscriptionDetails";
import MySubscription from "../../screens/MySubscriptions/view/MySubscription";

const { width } = Dimensions.get("screen");

const SubscriptionStackNavigator = createNativeStackNavigator();

const SubscriptionNavigator = () => {
  return (
    <SubscriptionStackNavigator.Navigator>
      <SubscriptionStackNavigator.Screen
        name="MySubscription"
        component={MySubscription}
        options={{
          title: "Subscriptions Ordered",
          headerTitle: () => (
            <SearchBox customWidth={true} placeHolder={"Search Customers"} />
          ),
        }}
      />

      <SubscriptionStackNavigator.Screen
        name="SubscriptionDetails"
        component={SubscriptionDetails}
        options={{
          title: "Subscription Details",
          headerTitle: () => (
            <SearchBox customWidth={true} placeHolder={"Search Products"} />
          ),
          headerBackVisible: false,
        }}
      />
    </SubscriptionStackNavigator.Navigator>
  );
};

export default SubscriptionNavigator;
