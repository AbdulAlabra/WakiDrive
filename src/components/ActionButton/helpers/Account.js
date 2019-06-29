import React, { Component } from 'react';
import { Form, Item, Text, Input, Label, Button, Title, Subtitle, button } from 'native-base';
import { Dimensions, StyleSheet, View, } from "react-native"

import ValidateForm from "../../FormValidatiom"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Loading from "../../Loading"
import AddDriver from "../../../request/delivery/newDriver"
import firebaseRN from "react-native-firebase"
import firebase from "../../Firebase"

import Auth from "../../auth"
const { height } = Dimensions.get('window');


class SignUpForm extends Component {
    state = {

        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        contryCode: "+966",
        userId: false,
        isModalVisible: false,
        logIn: false,
        fetching: false
    };

    componentWillMount() {

    }
    signUserUp() {
        const { fetching, logIn, firstName, lastName, phone, email, password } = this.state;
        //this.setState({ fetching: true });
        const isValid = ValidateForm(firstName, lastName, phone, email, password)
        if (isValid) {
            this.setState({ fetching: true });
            Auth(email, password, "signup", (user) => {

                if (user) {
                    console.log("SUCCESS");
                    this.addUser()
                }
                else {
                    console.log("FAILED");
                    this.setState({ fetching: false })
                }
            })
        }
    }

    clear() {
        this.setState({
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            phone: "",
            contryCode: "+966",
            acctStatus: "",
            userId: false,
            isModalVisible: false,
            warning: "",
            logIn: false,
            fetching: false
        })
        this.props.done()
    }

    addUser() {
        const { fetching, logIn, firstName, lastName, phone, email, password } = this.state;
        const userToken = firebase.auth().currentUser.getIdToken()
        const fcmToken = firebaseRN.messaging().getToken()
        fcmToken.then(fcm => {
            userToken.then(token => {
                AddDriver(firstName, lastName, phone, email, password, fcm, token)
                    .then(res => {
                        if (res.status === "ADDED") {
                            console.log("user is added");
                            this.clear()
                        }
                        else {
                            console.log("user is not aded");
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
                .catch(err => {
                    console.log(err)
                })
        })
            .catch(err => {
                console.log(err)
            })
    }
    render() {
        const { fetching, logIn, firstName, lastName, phone, email, password, userId } = this.state;

        if (logIn) {
            return <LogIn />
        }
        if (fetching) {
            return <Loading />
        }

        return (
            <KeyboardAwareScrollView
                contentContainerStyle={{
                    justifyContent: "space-around",
                    flex: 1
                }}
                resetScrollToCoords={{ x: 0, y: 0 }}
                scrollEnabled={true}
            >

                <View style={styles.title}>

                    <Title style={styles.titleText}>Creat An Account</Title>
                    <Subtitle style={styles.Subtitle}>or log in <Subtitle onPress={() => this.setState({ logIn: true })} style={{ color: "blue", fontWeight: "bold" }}>here</Subtitle> if you already have an account</Subtitle>

                </View>


                <Form style={styles.form}>
                    <Item style={styles.item} inlineLabel last>
                        <Label>First Name</Label>
                        <Input
                            label={"f1"}
                            blurOnSubmit={false}
                            returnKeyType={"next"}
                            value={this.state.firstName}
                            onChangeText={firstName => this.setState({ firstName, isOpen: false })}
                        />
                    </Item>

                    <Item style={styles.item} inlineLabel last>
                        <Label>Last Name</Label>
                        <Input
                            keyboardType="name-phone-pad"
                            blurOnSubmit={false}
                            label={"f2"}

                            returnKeyType={"next"}
                            value={this.state.lastName}
                            onChangeText={lastName => this.setState({ lastName, isOpen: false })}
                        />
                    </Item>

                    <Item style={styles.item} inlineLabel last>
                        <Label>Phone</Label>
                        <Input
                            blurOnSubmit={false}
                            keyboardType="phone-pad"
                            label={"f3"}
                            returnKeyType={"next"}
                            value={this.state.phone}
                            onChangeText={phone => this.setState({ phone, isOpen: false })}
                        />

                    </Item>
                    <Item style={styles.item} inlineLabel last>
                        <Label>Email</Label>
                        <Input
                            keyboardType="email-address"
                            label={"f4"}
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

                </Form>
                <View style={styles.buttonContainer}>

                    <Button onPress={() => this.signUserUp()} style={styles.Button} block>
                        <Text>Sign up now</Text>
                    </Button>
                </View>
            </KeyboardAwareScrollView>

        );
    }
}

class LogIn extends Component {
    state = {
        signUp: false,
        email: "",
        password: "",
    }
    render() {
        const { signUp } = this.state
        if (signUp) {
            return <SignUpForm />
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
                    <Subtitle style={styles.Subtitle}>or sign up <Subtitle onPress={() => this.setState({ signUp: true })} style={{ color: "blue", fontWeight: "bold" }}>here</Subtitle> if you don't already have an account</Subtitle>
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

                </Form>
                <View style={styles.buttonContainer}>
                    <Button style={styles.Button} block>
                        <Text>Log in</Text>
                    </Button>
                </View>

            </KeyboardAwareScrollView>

        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    title: {
        //marginTop:10,
        flex: 0.4,
        justifyContent: "center",
        // backgroundColor: "yellow",
        justifyContent: "space-evenly"

    },
    titleText: {
        //margin:50
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


export default SignUpForm