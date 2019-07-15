import React, { Component } from 'react';
import { Form, Item, Text, Input, Label, Button, Title, Subtitle } from 'native-base';
import { StyleSheet, View, TouchableOpacity } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import localStorage from "../localStorage"
import message from "../message"
import Password from "./Password"
import firebase from "../Firebase";
import LoadingScreen from "../Loading"

import SignUpForm from "./Account"
import Profile from "./Profile"

class LogIn extends Component {

    state = {
        signUp: false,
        LogIn: false,
        Loading: false,
        hasAcount: undefined,
        forgotPassword: false,
        showProfile: false,
        email: "",
        password: "",
    }

    componentWillMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                //logged in
                console.log(user)
                this.setState({ showProfile: true });
            }
            else {
                //logged out
                localStorage.retrieveData("@email")
                    .then(email => {
                        if (email) {
                            this.setState({ email, hasAcount: true });
                        }
                    })
                    .catch(err => {
                        console.log(err)

                    })
            }
        })

    }

    LogInUser() {
        const { email, password } = this.state
        console.log(email)
        console.log(password)
        this.setState({ Loading: true })
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(res => {
                console.log(res)
                this.setState({ Loading: false });
                localStorage.storeData("@email", email)
                    .then(() => {
                        this.props.done()
                    })
                    .catch(err => {
                        console.log(err)
                    })


            })
            .catch(err => {
                this.setState({ Loading: false });
                console.log(err);
                message("Falied", err.message);

            })

    }

    signUserUp() {
        const { hasAcount } = this.state

        if (hasAcount) {
            message("You already have an account", "you cannot have more than two account.");
        }
        else {
            this.setState({ signUp: true });
        }

    }

    forgotPassword() {
        this.setState({ forgotPassword: true })
    }

    render() {
        const { signUp, forgotPassword, Loading, showProfile } = this.state
        if (showProfile) {
            return <Profile />
        }
        if (Loading) {
            return <LoadingScreen />
        }
        if (signUp === true) {
            return <SignUpForm
                done={() => this.props.done()}
            />

        }

        if (forgotPassword) {
            return <Password
            />
        }
        return (
            <KeyboardAwareScrollView
                contentContainerStyle={{
                    flex: 1
                }}
                resetScrollToCoords={{ x: 0, y: 0 }}
                scrollEnabled={true}
            >

                <View style={styles.title}>
                    <Title style={styles.titleText}>Log in to your account</Title>
                    <Subtitle style={styles.Subtitle}>or sign up <Subtitle onPress={() => this.signUserUp()} style={{ color: "blue", fontWeight: "bold" }}>here</Subtitle> if you don't already have an account</Subtitle>
                </View>

                <Form style={styles.form}>
                    <Item style={styles.item} inlineLabel last>
                        <Label>Email</Label>
                        <Input
                            label={"f4"}
                            keyboardType="email-address"
                            returnKeyType={"next"}
                            value={this.state.email}
                            onChangeText={email => this.setState({ email, isOpen: false })}
                        />

                    </Item>
                    <Item style={styles.item} inlineLabel last>
                        <Label>Password</Label>
                        <Input
                            blurOnSubmit={false}
                            label={"f5"}
                            returnKeyType={"done"}
                            value={this.state.password}
                            onChangeText={password => this.setState({ password, isOpen: false })}
                            secureTextEntry={true}
                        />
                    </Item>

                    <TouchableOpacity onPress={() => this.forgotPassword()}>
                        <Subtitle style={{ color: "blue" }}>Forget password</Subtitle>
                    </TouchableOpacity>

                </Form>
                <View style={styles.buttonContainer}>
                    <Button onPress={() => this.LogInUser()} style={styles.Button} block>
                        <Text>Log in</Text>
                    </Button>
                </View>

            </KeyboardAwareScrollView >

        );
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    password: {

    },

    title: {
        //marginTop:10,
        flex: 0.4,
        justifyContent: "center",
        // backgroundColor: "yellow",
        justifyContent: "space-evenly"

    },
    titleText: {
        color: "black"
    },
    Subtitle: {
        color: "black",
        //marginBottom:10
        //flex: 0.05

    },
    Button: {
        margin: 10,
        borderRadius: 50,
        flex: 0.6
    },
    buttonContainer: {
        flex: 0.3,
        justifyContent: "center",
        //backgroundColor: "red"
    },
    form: {
        flex: 1,
        //marginTop:50,
        justifyContent: "space-around",
        //backgroundColor: "black",
    },
    item: {
        borderRadius: 10,
        //backgroundColor: "white",
        //margin: 10
    }

});

export default LogIn