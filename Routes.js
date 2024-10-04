import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import BottomNav from "./src/layout/BottomNav";
import AuthNav from "./src/layout/AuthNav";
import { useAuthContext } from "./src/contexts/authContext";

const Stack = createNativeStackNavigator();

function Routes() {
  const { isLoggedIn } = useAuthContext();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn() ? (
          <Stack.Screen
            name="BottomNav"
            component={BottomNav}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Auth"
            component={AuthNav}
            options={{
              headerShown: false,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;
