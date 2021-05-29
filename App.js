import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react";
import WelcomeScreen from "./Screens/welcomeScreen";
import { AppDrawerNavigator } from "./components/appDrawerNavigator";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

export default function App() {
  return <AppContainer />;
}

const switchNavigator = createSwitchNavigator({
  WelcomeScreen: { screen: WelcomeScreen },
  Drawer: { screen: AppDrawerNavigator },
});

const AppContainer = createAppContainer(switchNavigator);
