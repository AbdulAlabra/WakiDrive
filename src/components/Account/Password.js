import React, { Component } from 'react';
import { Form, Item, Text, Input, Label, Button, Title, Subtitle } from 'native-base';
import { StyleSheet, View, TouchableOpacity } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import localStorage from "../localStorage"
import message from "../message"
import firebase from "../Firebase"
import LogIn from "./LogIn"

import Loading from "../Loading"

class Password extends Component {
    state = {
        email: "",
        ChangeEmail: false,
        Loading: false,
        logIn: false,
        message: "Change password for this email: ",
    }

    componentWillMount() {
        localStorage.retrieveData("@email")
            .then(email => {
                if (email) {
                    this.setState({ email });
                }
            })
            .catch(err => {
                console.log(err)

            });
    }

    sendPassword(email) {
        this.setState({ message: "sending ...." })
        firebase.auth().sendPasswordResetEmail(email)
            .then(res => {
                console.log(res)
                this.setState({ message: "a link has been sent to this Email:" })
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        const { email, message, logIn } = this.state

        if (logIn) {
            return <LogIn />
        }
        return (
            <View style={styles.container}>
                <Button onPress={() => this.sendPassword(email)} info style={{ alignSelf: "center" }}>
                    <Text>Change Password</Text>
                </Button>

                <View>
                    <Title style={{ color: "black", overflow: "visible" }}>{message}</Title>
                    <Text style={{ alignSelf: "center" }}>{email}</Text>
                </View>

                <Button onPress={() => this.setState({ logIn: true })} info style={{ alignSelf: "center" }}>
                    <Text>Log In</Text>
                </Button>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-around",
        flexDirection: "column",
        alignItems: "center"
    },
    content: {
        flex: 1,

    }


});
export default Password