import React, { Component } from 'react';
import { Form, Item, Text, Input, Label, Button, Title, Subtitle } from 'native-base';
import { StyleSheet, View, TouchableOpacity } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import localStorage from "../localStorage"
import message from "../message"
import SignUpForm from "./Account"
import Email from "../verifyUserInfo/Email"
import Password from "./Password"
import firebase from "../Firebase";
import LoadingScreen from "../Loading"

class Profile extends Component {
    state = {
        Loading: false,
        displayName: "",
        email: "",
        phoneNumber: "",
        emailVerified: false,

    }
    componentWillMount() {
        this.getUserInfo();
    }
    getUserInfo() {
        const user = firebase.auth().currentUser
        console.log(user)
        const { displayName, email, emailVerified, phoneNumber } = user
        this.setState({ displayName, email, emailVerified, phoneNumber });

    }
    render() {
        const { displayName, email, emailVerified, phoneNumber } = this.state
        return (
            <View style={styles.container}>
                <Text>Name: {displayName}</Text>
                <Text>Email: {email}</Text>
                <Text>Phone: {phoneNumber}</Text>
                <Text>Is Email Valid? : {emailVerified}</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:"center",
        justifyContent: "space-between",
    }
});

export default Profile