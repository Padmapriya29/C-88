import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import MyHeader from "../components/myHeader";
import db from "../Config";
import firebase from "firebase";

export default class ProfileSettingScreen extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      moblieNumber: "",
      docId: "",
    };
  }

  getUserDetails = () => {
    var user = firebase.auth().currentUser;
    var email = user.email;
    db.collection("users")
      .where("userName", "==", email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            email: data.userName,
            firstName: data.first_name,
            lastName: data.last_name,
            moblieNumber: data.mobile_number,
            address: data.address,
            docId: doc.id,
          });
        });
      });
  };

  updateUserDetails = () => {
    db.collection("users").doc(this.state.docId).update({
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      mobile_number: this.state.moblieNumber,
      address: this.state.address,
    });
    Alert.alert("Profile Updated Successfully");
  };

  componentDidMount() {
    this.getUserDetails();
  }

  render() {
    return (
      <View>
        <MyHeader title="My Profile" navigation={this.props.navigation} />
        <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
          <Text style={styles.modalTitle}> Registration</Text>
          <TextInput
            style={styles.formTextInput}
            placeholder={"First Name"}
            maxLength={10}
            onChangeText={(txt) => {
              this.setState({
                firstName: txt,
              });
            }}
            value={this.state.firstName}
          />

          <TextInput
            style={styles.formTextInput}
            placeholder={"Last Name"}
            maxLength={10}
            onChangeText={(txt) => {
              this.setState({
                lastName: txt,
              });
            }}
            value={this.state.lastName}
          />

          <TextInput
            style={styles.formTextInput}
            placeholder={"Mobile Number"}
            maxLength={10}
            keyboardType={"numeric"}
            onChangeText={(txt) => {
              this.setState({
                moblieNumber: txt,
              });
            }}
            value={this.state.moblieNumber}
          />

          <TextInput
            style={[styles.formTextInput, { height: 200 }]}
            placeholder={"Address"}
            multiline={true}
            onChangeText={(txt) => {
              this.setState({
                address: txt,
              });
            }}
            value={this.state.address}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.updateUserDetails();
            }}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: "center",
    borderColor: "#ffab91",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  keyboardAvoidingView: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: 200,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    color: "#ff5722",
    fontSize: 15,
    fontWeight: "bold",
  },
});
