import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Signout from "../../screens/Signout/view/Signout,";
import UpdatePin from "./../../screens/SignIn/views/UpdatePin";
import Menu from "../Menu";
import { useAuthContext } from "../../contexts/authContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MyProducts from "../../screens/MyProducts/view/MyProducts";
import NewProduct from "../../screens/MyProducts/view/NewProduct";
import AddNewProductIcon from "../../screens/MyProducts/view/AddNewProductIcon";
import UpdateProduct from "../../screens/MyProducts/view/UpdateProduct";
import AddRetailer from "../../screens/AddRetailer/view/AddRetailer";
import SearchBox from "../../component/SearchBox";
import Users from "../../screens/UserManagement/view/users";
import NewUser from "../../screens/UserManagement/view/newUser";
import EditUser from "../../screens/UserManagement/view/editUser";

const MenuStack = createNativeStackNavigator();

const MenuNavigator = () => {
  const { user } = useAuthContext();
  return (
    <MenuStack.Navigator>
      <MenuStack.Screen
        name="MenuList"
        component={Menu}
        options={{
          title: ` ${user.userName}`,
          headerLeft: () => <MaterialCommunityIcons name="account" size={30} />,
        }}
      />
      <MenuStack.Screen
        name="AddRetailer"
        component={AddRetailer}
        options={{ title: "Add Customer" }}
      />
      <MenuStack.Screen name="SignOut" component={Signout} />
      <MenuStack.Screen
        name="UpdatePin"
        component={UpdatePin}
        options={{ title: "Update PIN" }}
      />
      <MenuStack.Screen
        name="MyProducts"
        component={MyProducts}
        options={{
          title: "My Products",
          headerRight: () => <AddNewProductIcon screenName={"NewProduct"} />,
          headerLeft: () => <SearchBox placeHolder={"Search Products"} />,
          headerTitle: () => null,
        }}
      />
      <MenuStack.Screen
        name="NewProduct"
        component={NewProduct}
        options={{
          title: "Add New Product",
        }}
      />
      <MenuStack.Screen
        name="UpdateProduct"
        component={UpdateProduct}
        options={{
          title: "UpdateProduct",
        }}
      />
      <MenuStack.Screen
        name="user"
        component={Users}
        options={{
          title: "My Users",
          headerRight: () => <AddNewProductIcon screenName={"newUser"} />,
          headerLeft: () => <SearchBox placeHolder={"Search Users"} />,
          headerTitle: () => null,
        }}
      />
      <MenuStack.Screen
        name="newUser"
        component={NewUser}
        options={{
          title: "Add User",
        }}
      />
      <MenuStack.Screen
        name="editUser"
        component={EditUser}
        options={{
          title: "Edit User",
        }}
      />
    </MenuStack.Navigator>
  );
};

export default MenuNavigator;
