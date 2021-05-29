import { createDrawerNavigator } from "react-navigation-drawer";
import { AppTabNavigator } from "./appTabNavigator";
import CustomSideBarMenu from "./customSideBarMenu";
import ProfileSettingScreen from "../Screens/profileSettingScreen";
import MyDonationsScreen from "../Screens/myDonationsScreen";
import NotificationScreen from "../Screens/notificationScreen";
import MyReceivedBooksScreen from "../Screens/myRecievedBooksScreen";

export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: { screen: AppTabNavigator },
    MyDonations: { screen: MyDonationsScreen },
    Notifications: { screen: NotificationScreen },
    MyProfile: { screen: ProfileSettingScreen },
    MyRecievedBooks: { screen: MyReceivedBooksScreen },
  },
  { contentComponent: CustomSideBarMenu },
  { initialRouteName: "Home" }
);
