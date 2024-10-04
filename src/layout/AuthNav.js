import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignIn from "../screens/SignIn/views/SignIn";
import SignUp from "../screens/SignIn/views/SignUp";
import UpdatePin from "../screens/SignIn/views/UpdatePin";

const AuthStackNavigator = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator>
      <AuthStackNavigator.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />
      <AuthStackNavigator.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
      <AuthStackNavigator.Screen
        name="UpdatePin"
        component={UpdatePin}
        options={{ headerShown: false }}
      />
    </AuthStackNavigator.Navigator>
  );
};

export default AuthNavigator;
