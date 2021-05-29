import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import BookDonateScreen from "../Screens/bookDonateScreen";
import RecieverDetailsScreen from "../Screens/recieverDetailsScreen";

export const AppStackNavigator = createStackNavigator(
  {
    BookDonateList: {
      screen: BookDonateScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    RecieverDetails: {
      screen: RecieverDetailsScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: "BookDonateList",
  }
);
