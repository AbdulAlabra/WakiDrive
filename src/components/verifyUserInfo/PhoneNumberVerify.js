import React, { Component } from 'react';
import { Form, Item, Text, Input, Label, Button, Title, View } from 'native-base';
import RNFirebase from "react-native-firebase"
import localStorage from "../localStorage"
import firebase from '../Firebase';
import Modal from "../ActionButton/Modal"

class VerifyPhoneNumber extends Component {
    state = {
        phoneNumber: "",
        lebal: "+966 ",
        countryCode: "+966",
        warning: false,
        message: false,
        isModalVisible: false,

        codeInput: "",
        confirmResult: null,
        isConfirmed: false,
        isCodeSent: false
    };
    _toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });
    componentDidMount() {
        this.setState({ isModalVisible: true })
    }

    sendAgain() {
        this.setState({ confirmResult: null, isConfirmed: false, isCodeSent: false, lebal: "+966 ", phoneNumber: "", message: "" });
    }
    
    signIn() {
        const { phoneNumber } = this.state;
        if (phoneNumber.length < 9) {
            this.setState({ warning: "Too short phone number" })
        }
        else {
            this.setState({ message: 'Sending code ...' });
            let phone = this.state.countryCode + phoneNumber;
            RNFirebase.auth().signInWithPhoneNumber(phone)
                .then(confirmResult => {
                    this.setState({ confirmResult, message: 'Code has been sent!', isCodeSent: true, lebal: "Code " })

                    console.log(confirmResult)

                })
                .catch(error => this.setState({ message: false, warning: `Phone Number Error: ${error.message}` }));
        }
    };

    phoneNumberCode() {
        const { phoneNumber } = this.state;
        if (phoneNumber.length < 9) {
            this.setState({ warning: "Too short phone number" })
        }
        else {
            this.setState({ message: 'Sending code ...' });
            let phone = this.state.countryCode + phoneNumber;
            RNFirebase.auth().verifyPhoneNumber(phone)
                .then(confirmResult => {
                    console.log(confirmResult)
                    let state = confirmResult.state

                    if (state === "sent") {
                        this.setState({ confirmResult: confirmResult.verificationId, message: 'Code has been sent!', isCodeSent: true, lebal: "Code " })
                    }
                    else {
                        this.setState({ confirmResult: null, message: 'something is wrong.. please try again later', isCodeSent: false, lebal: "Phone " })

                    }

                })
                .catch(error => this.setState({ message: false, warning: `Phone Number Error: ${error.message}` }));
        }
    }
    phoneNumberConfirm() {
        const { codeInput, confirmResult, phoneNumber, countryCode } = this.state;
        console.log("code input : " + codeInput);
        console.log()
        if (confirmResult && codeInput) {
            let phone = countryCode + phoneNumber
            RNFirebase.auth().verifyPhoneNumber(phone).on("state_changed", (phoneAuth) => {
                console.log(phoneAuth)
                let state = phoneAuth.state
                switch (state) {
                    case "sent":
                    //this.setState({ confirmResult: phoneAuth, message: 'Code has been sent!', isCodeSent: true, lebal: "Code " })

                    default:
                        break;
                }
            })
                .then(confirmResult => {
                    console.log(confirmResult)

                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    confirmCode() {
        const { codeInput, confirmResult } = this.state;
        //console.log(codeInput);
        if (confirmResult && codeInput) {
             let credential = RNFirebase.auth.PhoneAuthProvider.credential(confirmResult, codeInput)
             console.log(credential);
            // confirmResult.confirm(codeInput)
            //     .then((user) => {
            //         this.setState({ message: 'Code Confirmed!' });
            //         this.verified();

            //     })
            //     .catch(error => this.setState({ message: `Code Confirm Error: ${error.message}` }));
        }
    };

    verified() {
        console.log("phone number " + this.state.phoneNumber);
        localStorage.retrieveData("@driverID")
            .then(driverID => {
                firebase.auth().currentUser.updateProfile({
                    phoneNumber: this.state.phoneNumber
                });
                firebase.database().ref(`drivers/registeredDrivers/${driverID}/driverStatus`).update({
                    phoneVerified: true
                }).then(() => {
                    firebase.database().ref(`drivers/registeredDrivers/${driverID}/driverInfo`).update({
                        phone: this.state.countryCode + this.state.phoneNumber
                    }).then(() => {
                        console.log("done");
                        localStorage.storeData("@phoneVerified", true)
                            .then(res => {
                                this.setState({ isConfirmed: true })
                                this.props.onComplete()
                            })
                            .catch(err => {
                                console.log(err)
                            })

                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(err => {
                    console.log(err);
                })
            })
            .catch(err => {
                console.log(err);
            })
    }


    render() {
        const { isModalVisible, isConfirmed, phoneNumber, lebal, confirmResult, codeInput, warning, message, isCodeSent } = this.state
        let button = null;
        if (isCodeSent) {
            button = <Button full warning style={{ height: '10%', top: 100 }} onPress={() => {
                //this.confirmCode();
                this.phoneNumberConfirm();
            }}>
                <Text>Verify Now</Text>
            </Button>
        }
        else {
            button = <Button full info style={{ height: '10%', top: 100 }} onPress={() => {
                //this.signIn();
                this.phoneNumberCode()

            }}>
                <Text>Get Secuirty Code To Your Phone Now</Text>
            </Button>
        }
        return (
            <Modal color='#9b59b6' toggleModal={this._toggleModal} isModalVisible={(isConfirmed === true) ? false : isModalVisible}>
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <Title>Phone Verification</Title>
                    <Text style={{ textAlign: "center", margin: 10 }}>Please enter your phone number below. We will send a secuirty code to the following number :</Text>
                    <Title>{lebal} {phoneNumber}</Title>
                    <Form>
                        <Item style={{ marginTop: "10%" }} fixedLabel last>
                            <Label style={{ fontSize: 25 }}>{lebal}</Label>
                            <Input
                                value={(confirmResult !== null) ? codeInput : phoneNumber}
                                onChangeText={phoneNumber => {
                                    if (confirmResult !== null) {
                                        this.setState({ codeInput: phoneNumber })
                                    }
                                    else {
                                        if (this.state.phoneNumber.length === 0 && Number(phoneNumber) === 0) {
                                            this.setState({ warning: "do not inclubde the 0 at the beginning of your number" })
                                        }
                                        // else if (phoneNumber.length >= 10) {
                                        //     this.setState({ warning: "Phone number is more than 10" })
                                        // }
                                        else {
                                            this.setState({ phoneNumber, warning: "" })
                                        }
                                    }
                                }}
                            />
                        </Item>
                    </Form>
                    <Text style={{ textAlign: "center", color: "red" }}>{warning}</Text>
                    <Text onPress={() => this.sendAgain()} style={{ textAlign: "center", color: "blue" }}>{(isCodeSent === true) ? "Send Again" : ""}</Text>

                    <Title>{message}</Title>
                    {button}
                </View>
            </Modal>

        );
    }
}

export default VerifyPhoneNumber