import React from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  FlatList
} from "react-native";
import db from "../Config";
import firebase from "firebase";
import MyHeader from "../components/myHeader";
import { BookSearch } from "react-native-google-books";

export default class BookRequestScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      bookName: "",
      reasonForRequest: "",
      requestId: "",
      requestedBookName: "",
      bookStatus: "",
      docId: "",
      userDocId: "",
      isBookRequestActive: false,
      dataSource: "",
      showFlatlist: false,
    };
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addRequest = async (bookName, reasonForRequest) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();
    var books = await BookSearch.searchbook(
      bookName,
      "AIzaSyCzVfa0ANh3MPsJioYI7jzXOaIke3aWvBM"
    );
    db.collection("requested_books").add({
      user_id: userId,
      book_name: bookName,
      reason_for_request: reasonForRequest,
      request_id: randomRequestId,
      book_status: "requested",
      date: firebase.firestore.FieldValue.serverTimestamp(),
      image_link:books.data[0].volumeInfo.imageLinks.smallThumbnail
    });

    await this.getBookRequest();
    db.collection("users")
      .where("userName", "==", userId)
      .get()
      .then((qry) => {
        qry.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            isBookRequestActive: true,
          });
        });
      });

    this.setState({
      bookName: "",
      reasonForRequest: "",
      requestedId: randomRequestId,
    });

    return Alert.alert("Book Requested Successfully");
  };

  getBookRequest = () => {
    db.collection("requested_books")
      .where("user_id", "==", this.state.userId)
      .get()
      .then((qry) => {
        qry.forEach((doc) => {
          if (doc.data().book_status !== "recieved") {
            this.setState({
              requestId: doc.data().request_id,
              requestedBookName: doc.data().book_name,
              bookStatus: doc.data().book_status,
              docId: doc.id,
            });
          }
        });
      });
  };

  getIsBookRequestActive = (userId) => {
    db.collection("users")
      .where("userName", "==", userId)
      .onSnapshot((qry) => {
        qry.forEach((doc) => {
          this.setState({
            isBookRequestActive: doc.data().isBookRequestActive,
            userDocId: doc.id,
          });
        });
      });
  };

  updateBookRequestStatus = () => {
    db.collection("requested_books").doc(this.state.docId).update({
      book_status: "received",
    });

    db.collection("users")
      .where("userName", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            isBookRequestActive: false,
          });
        });
      });
  };

  sendNotification = () => {
    db.collection("users")
      .where("userName", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().first_name;
          var lastname = doc.data().last_name;

          db.collection("all_notifications")
            .where("request_id", "==", this.state.requestId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorId = doc.data().donor_id;
                var bookName = doc.data().book_name;

                db.collection("all_notifications").add({
                  targeted_user_id: donorId,
                  message:
                    name + " " + lastname + " received the book " + bookName,
                  notification_status: "unread",
                  book_name: bookName,
                });
              });
            });
        });
      });
  };

  receivedBooks = (bookName) => {
    var userId = this.state.userId;
    var requestId = this.state.requestId;
    db.collection("received_books").add({
      user_id: userId,
      book_name: bookName,
      request_id: requestId,
      book_status: "received",
    });
  };

  componentDidMount() {
    this.getBookRequest();
    this.getIsBookRequestActive(this.state.userId);
  }

  async getBooksFromApi(bookName) {
    this.setState({
      bookName: bookName,
    });
    if (bookName.length > 2) {
      var books = await BookSearch.searchbook(
        bookName,
        "AIzaSyCzVfa0ANh3MPsJioYI7jzXOaIke3aWvBM"
      );
      this.setState({
        dataSource: books.data,
        showFlatlist: true,
      });
    }
  }

  renderItem = ({ item, i }) => {
    return (
      <TouchableHighlight
        style={{
          alignItems: "center",
          backgroundColor: "pink",
          padding: 10,
          width: "90%",
        }}
        activeOpacity={0.6}
        underlayColor={"lightgreen"}
        onPress={() => {
          this.setState({
            showFlatlist: false,
            bookName: item.volumeInfo.title,
          });
        }}
        bottomDivider
      >
        <Text>{item.volumeInfo.title}</Text>
      </TouchableHighlight>
    );
  };

  render() {
    if (this.state.isBookRequestActive) {
      //status screen
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View
            style={{
              borderColor: "orange",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
          >
            <Text>Book Name</Text>
            <Text>{this.state.requestedBookName}</Text>
          </View>
          <View
            style={{
              borderColor: "orange",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
          >
            <Text>Book Status</Text>
            <Text>{this.state.bookStatus}</Text>
          </View>
          <TouchableOpacity
            style={{
              borderColor: "orange",
              borderWidth: 1,
              backgroundColor: "orange",
              width: 360,
              alignSelf: "center",
              alignItems: "center",
              height: 30,
              marginTop: 30,
            }}
            onPress={() => {
              this.sendNotification();
              this.updateBookRequestStatus();
              this.receivedBooks(this.state.requestedBookName);
            }}
          >
            <Text>I received the book</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <MyHeader title="Request Book" navigation={this.props.navigation} />
          <KeyboardAvoidingView style={styles.keyBoardStyle}>
            <TextInput
              style={styles.formTextInput}
              placeholder={"enter book name"}
              onChangeText={(text) => {
                this.getBooksFromApi(text);
              }}
              onClear={(text) => {
                this.getBooksFromApi("");
              }}
              value={this.state.bookName}
            />
            {this.state.showFlatlist ? (
              <FlatList
                data={this.state.dataSource}
                renderItem={this.renderItem}
                enableEmptySections={true}
                style={{
                  marginTop: 10,
                }}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <View style={{ alignItems: "center" }}>
                <TextInput
                  style={[styles.formTextInput, { height: 300 }]}
                  multiline
                  numberOfLines={8}
                  placeholder={"Why do you need the book"}
                  onChangeText={(text) => {
                    this.setState({
                      reasonForRequest: text,
                    });
                  }}
                  value={this.state.reasonForRequest}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.addRequest(
                      this.state.bookName,
                      this.state.reasonForRequest
                    );
                  }}
                >
                  <Text>Request</Text>
                </TouchableOpacity>
              </View>
            )}
          </KeyboardAvoidingView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  button: {
    width: "75%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: 20,
  },
});
