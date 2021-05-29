import React from "react";
import { Header, Icon, Badge } from "react-native-elements";
import { View } from "react-native";
import db from "../Config";
import firebase from "firebase";

export default class MyHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      userId: firebase.auth().currentUser.email,
    };
  }

  BellIconWithBadge = () => {
    return (
      <View>
        <Icon
          name="bell"
          type="font-awesome"
          color="#FCEDF2"
          onPress={() => {
            this.props.navigation.navigate("Notifications");
          }}
        />
        <Badge
          value={this.state.value}
          containerStyle={{ position: "absolute", top: -4, right: -4 }}
        />
      </View>
    );
  };

  getNumberOfUnreadNotifications() {
    db.collection("all_notifications")
      .where("notification_status", "==", "unread")
      .where("targeted_user_id", "==", this.state.userId)
      .onSnapshot((qry) => {
        var unreadNotification = qry.docs.map((doc) => doc.data());
        this.setState({
          value: unreadNotification.length,
        });
      });
  }

  componentDidMount(){
      this.getNumberOfUnreadNotifications();
  }

  render() {
    return (
      <Header
        leftComponent={
          <Icon
            name="bars"
            type="font-awesome"
            color="#FCEDF2"
            onPress={() => {
              this.props.navigation.toggleDrawer();
            }}
          />
        }
        centerComponent={{
          text: this.props.title,
          style: { color: "#FFF", fontSize: 20, fontWeight: "bold" },
        }}
        rightComponent={<this.BellIconWithBadge {...this.props} />}
        backgroundColor="#C4CCF0"
      />
    );
  }
}
