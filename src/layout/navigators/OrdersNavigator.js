import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HeaderCart from "../../component/HeaderCart";
import Orders from "../../screens/orders/view/Orders";
import UpdateOrder from "../../screens/SalesOrder/views/UpdateOrder";
import Cart from "../../screens/SalesOrder/views/Cart";
import OrderDetail from "../../screens/OrderDetails/views/OrderDetails";
import SearchBox from "../../component/SearchBox";
import FilterIcon from "../../component/FilterIcon";

const OrderStackNavigator = createNativeStackNavigator();

const OrderNavigator = () => {
  return (
    <OrderStackNavigator.Navigator>
      <OrderStackNavigator.Screen
        name="OrdersList"
        component={Orders}
        options={{
          title: "My Orders",
          headerRight: () => <FilterIcon />,
          headerLeft: () => <SearchBox placeHolder={"Search Customers"} />,
          headerTitle: () => null,
        }}
      />
      <OrderStackNavigator.Screen
        name="OrderDetails"
        component={OrderDetail}
        options={{
          title: "Order Details",
        }}
      />
      <OrderStackNavigator.Screen
        name="UpdateOrder"
        component={UpdateOrder}
        options={{
          title: "Update Order",
          headerRight: () => <HeaderCart />,
          headerLeft: () => <SearchBox placeHolder={"Search Products"} />,
          headerTitle: () => null,
        }}
      />
      <OrderStackNavigator.Screen
        name="Cart"
        component={Cart}
        options={{
          title: "Cart",
        }}
      />
    </OrderStackNavigator.Navigator>
  );
};

export default OrderNavigator;
