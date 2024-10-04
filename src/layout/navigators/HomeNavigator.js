import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HeaderCart from "../../component/HeaderCart";
import { useAuthContext } from "../../contexts/authContext";
import Cart from "../../screens/SalesOrder/views/Cart";
import LandingScreen from "../../screens/landingpage/view/LandingScreen";
import CreateOrder from "../../screens/SalesOrder/views/CreateOrder";
import CreateSubscriptionOrder from "../../screens/Subscription/view/CreateSubscriptionOrder";
import EditOutletAddress from "../../screens/EditRetailerAddress/view/EditOutletAddress";
import SubscriptionSuccess from "../../screens/Subscription/view/SubscriptionSuccess";
import SearchBox from "../../component/SearchBox";

const HomeStackNavigator = createNativeStackNavigator();

const HomeNavigator = () => {
  const { user } = useAuthContext();

  return (
    <HomeStackNavigator.Navigator>
      <HomeStackNavigator.Screen
        name="LandingPage"
        component={LandingScreen}
        options={{
          title: user?.distributorName,
          headerTitle: () => (
            <SearchBox customWidth={true} placeHolder={"Search Customers"} />
          ),
        }}
      />
      <HomeStackNavigator.Screen
        name="CreateOrder"
        component={CreateOrder}
        options={{
          /*
          headerTitle: () => (
            <TextInput
              theme={{ roundness: 10 }}
              style={{
                marginHorizontal: 8,
                marginBottom: 5,
                width: "90%",
                marginLeft: "-10%",
              }}
              mode="outlined"
              placeholder="Search Products"
              onChangeText={(val) => setSearch(val)}
            />
          ),*/
          headerRight: () => <HeaderCart />,
          headerLeft: () => <SearchBox placeHolder={"Search Products"} />,
          headerTitle: () => null,
        }}
      />
      <HomeStackNavigator.Screen
        name="CreatSubOrder"
        component={CreateSubscriptionOrder}
        options={{
          title: "Create Subscription Order",
          // headerRight: () => <HeaderCart />,
          headerLeft: () => (
            <SearchBox placeHolder={"Search Products"} customWidth={true} />
          ),
          headerTitle: () => null,
          headerBackVisible: false,
        }}
      />
      <HomeStackNavigator.Screen
        name="Cart"
        component={Cart}
        options={{
          title: "Cart",
        }}
      />
      <HomeStackNavigator.Screen
        name="EditOutletAddress"
        component={EditOutletAddress}
        options={{
          title: "Edit Address",
        }}
      />
      <HomeStackNavigator.Screen
        name="SubscriptionSuccess"
        component={SubscriptionSuccess}
        options={{
          title: "Success",
        }}
      />
    </HomeStackNavigator.Navigator>
  );
};

export default HomeNavigator;
