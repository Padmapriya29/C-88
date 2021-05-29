import React from "react";
import BookRequestScreen from "../Screens/bookRequestScreen";
import { AppStackNavigator } from './appStackNavigator';
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Image } from "react-native";

export const AppTabNavigator = createBottomTabNavigator({
  DonateBooks: {
    screen: AppStackNavigator,
    navigationOptions: {
      tabBarIcon: (
        <Image
          source={require("../assets/request-list.png")}
          style={{ width: 20, height: 20 }}
        />
      ),
      tabBarLabel: "Donate Books",
    },
  },
  RequestBooks: {
    screen: BookRequestScreen,
    navigationOptions: {
      tabBarIcon: (
        <Image
          source={require("../assets/request-book.png")}
          style={{ width: 20, height: 20 }}
        />
      ),
      tabBarLabel: "Book Request",
    },
  },
});
