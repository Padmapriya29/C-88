import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  TextInput,
  ScrollView,
  Modal,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import db from "../Config";
import firebase from "firebase";
import SantaAnimation from "../components/santaAnimation";
export default class WelcomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      password: "",
      email: "",
      isModalVisible: false,
      firstName: "",
      lastName: "",
      address: "",
      moblieNumber: "",
      confirmPassword: "",
    };
  }

  showModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isModalVisible}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={{ width: "100%" }}>
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

              <TextInput
                style={styles.formTextInput}
                placeholder={"abc@example.com"}
                keyboardType={"email-address"}
                onChangeText={(txt) => {
                  this.setState({
                    email: txt,
                  });
                }}
                value={this.state.email}
              />

              <TextInput
                style={styles.formTextInput}
                placeholder={"Enter Password"}
                secureTextEntry={true}
                onChangeText={(txt) => {
                  this.setState({
                    password: txt,
                  });
                }}
                value={this.state.password}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={"Confirm Password"}
                secureTextEntry={true}
                onChangeText={(txt) => {
                  this.setState({
                    confirmPassword: txt,
                  });
                }}
                value={this.state.confirmPassword}
              />
              <View style={styles.modalBackButton}>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => {
                    this.SignUp(
                      this.state.email,
                      this.state.password,
                      this.state.confirmPassword
                    );
                  }}
                >
                  <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalBackButton}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    this.setState({
                      isModalVisible: false,
                    });
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  SignUp = (email, password, confirmPassword) => {
    if (password !== confirmPassword) {
      return Alert.alert("Password doesn't match\nCheck your password.");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((response) => {
          //create users collection
          db.collection("users").add({
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            address: this.state.address,
            mobile_number: this.state.moblieNumber,
            userName: this.state.email,
            isBookRequestActive: false,
          });

          return Alert.alert("User addes successfully!", "", [
            {
              text: "OK",
              onPress: () => {
                this.setState({ isModalVisible: false });
              },
            },
          ]);
        })
        .catch(function (error) {
          var errorCode = error.code;
          var errorMeassage = error.message;
          return Alert.alert(errorMeassage);
        });
    }
  };

  Login = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        // return Alert.alert("user Logged In successfully");
        this.props.navigation.navigate("DonateBooks");
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMeassage = error.message;
        return Alert.alert(errorMeassage);
      });
  };
  render() {
    return (
    <View style={styles.container}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {this.showModal()}
      </View>
      <View style={styles.logoContainer}>
       <SantaAnimation/>
        <Text style={styles.title}>Book Santa</Text>
      </View>
      <TouchableWithoutFeedback>
        <KeyboardAvoidingView>
          <TextInput
            style={styles.formTextInput}
            placeholder={"abc@example.com"}
            keyboardType={"email-address"}
            onChangeText={(txt) => {
              this.setState({
                email: txt,
              });
            }}
            value={this.state.email}
          />

          <TextInput
            style={styles.formTextInput}
            placeholder={"enter password"}
            secureTextEntry={true}
            onChangeText={(txt) => {
              this.setState({
                password: txt,
              });
            }}
            value={this.state.password}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.Login(this.state.email, this.state.password);
            }}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.setState({ isModalVisible: true });
            }}
          >
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "aqua",
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    width: 150,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    margin: 10,
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
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 30,
    color: "#ff5722",
    margin: 50,
  },
  modalContainer: {
    flex: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffff",
    marginRight: 30,
    marginLeft: 30,
    marginTop: 80,
    marginBottom: 80,
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
  registerButton: {
    width: 200,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 30,
  },
  registerButtonText: {
    color: "#ff5722",
    fontSize: 15,
    fontWeight: "bold",
  },
  cancelButton: {
    width: 200,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  cancelButtonText: {
    color: "#ff5722",
  },
});

//#FCEDF2 lighter pink
//#FED8F1 light pink
//#F6C6DE dark pink
//#F2B5D4 darker pink
//#C4CCF0 purple
