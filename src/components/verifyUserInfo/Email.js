import React, { Component } from 'react';
import { Form, Item, Text, Input, Label, Button, Title, View } from 'native-base';
import localStorage from "../localStorage"
import firebase from '../Firebase';
import Modal from "../ActionButton/Modal"
import Alert from "../Alert"

class Email extends Component {
    state = {
        email: "",
        isConfirmed: false,
        warning: "",
        message: "",
        oldEmail: "",

        isModalVisible: false,
        ChangeEmail: false,
        mustLogIn: false,
        password: "",
        isLinkSent: false
    };
    componentWillMount() {
        this.getEmail();
    }
    getEmail() {
        firebase.auth().onAuthStateChanged(user => {
            console.log(user)
            if (user) {
                const email = user.email
                this.setState({ isModalVisible: true, oldEmail: email })
            }
            else {
                return
            }
        })
    }

    _toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });

    verified() {
        const email = firebase.auth().currentUser.email

        localStorage.retrieveData("@driverID")
            .then(driverID => {
                firebase.auth().currentUser.updateProfile({
                    email: email
                });
                firebase.database().ref(`drivers/registeredDrivers/${driverID}/driverStatus`).update({
                    emailVerified: true
                }).then(() => {
                    firebase.database().ref(`drivers/registeredDrivers/${driverID}/driverInfo`).update({
                        email: email
                    }).then(() => {
                        console.log("done");
                        localStorage.storeData("@emailVerified", true)
                        this.setState({ isConfirmed: true })

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
    verify() {

        firebase.auth().currentUser.reload().then(ok => {
            const user = firebase.auth().currentUser
            const email = user.email;
            const isVerified = user.emailVerified;
            console.log(email)
            console.log(isVerified)
            if (isVerified) {
                Alert("Verified !", "You can start driving now. \nThanks :)", () => this.verified(), () => this.verified())
            }
            else {
                Alert(email, "please check your email we have sent a link but you have not open it yet", () => console.log("ok"), () => console.log("cancel"))
            }

        }).catch(err => {
            console.log(err);
        })

    }
    sendLink() {
        firebase.auth().currentUser.sendEmailVerification().then(() => {
            this.setState({ message: "Link is sent !", isLinkSent: true })
        }).catch(err => {
            console.log(err)
            this.setState({ warning: err.message })
        })
    }
    updateEmail() {
        const { email } = this.state
        let user = firebase.auth().currentUser;
        user.updateEmail(email.trim()).then(res => {
            console.log(res)
            console.log("updated");
            this.setState({ message: "We have updated your email and sent you the link" })
            this.sendLink();

        }).catch(err => {
            console.log(err);
            let code = err.code
            if (code === "auth/requires-recent-login") {
                this.setState({ mustLogIn: true, email: "" });
            }
            this.setState({ warning: err.message })
            // console.log(err)
            // console.log(err);
        });
    }
    updateEmailAssurance() {
        Alert("Make Sure this is the right email", this.state.email + "\ndoes it look right?", () => this.updateEmail(), () => console.log('cancel'), "Yes", "No");
    }
    login() {
        const { email, password } = this.state
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
                console.log("user is Signed in")
                this.setState({ message: "Signed in successfully\nenter your new email", email: "", mustLogIn: false });
                console.log(user)
            })
            .catch((err) => {
                this.setState({ warning: err.message })
                console.log('something is wrong with signning in')
                console.log(err)
            })
    }

    render() {
        const { ChangeEmail, oldEmail, email, mustLogIn, password, isLinkSent } = this.state
        let emailText = `We ${(ChangeEmail === true) ? "will sent" : "have sent"} a verification link to this email`
        let LogInText = `You have to login with the old email & password before changeing your email`
        let form = null;
        let requireLogIn = null;
        let chnageButton = <Button full warning style={{ marginTop: 20 }} onPress={() => {
            // this.updateEmail()
            this.setState({ ChangeEmail: true, isLinkSent: false, message: "", warning: "" })
        }}>
            <Text>Change Email</Text>
        </Button>
        if (mustLogIn) {
            requireLogIn = <Item style={{ marginTop: "10%" }} fixedLabel last>
                <Label style={{ fontSize: 20 }}>Password</Label>
                <Input
                    value={password}
                    onChangeText={password => {
                        console.log(password)
                        this.setState({ password })
                    }}
                />
            </Item>

        }
        if (ChangeEmail) {
            chnageButton = null
            form = <Form>
                <Item style={{ marginTop: "10%" }} fixedLabel last>
                    <Label style={{ fontSize: 25 }}>Email</Label>
                    <Input
                        value={email}
                        onChangeText={email => {
                            console.log(email)
                            this.setState({ email })
                        }}
                    />
                </Item>
                {requireLogIn}
            </Form>

        }

        return (
            <Modal color='#9b59b6' toggleModal={this._toggleModal} isModalVisible={(this.state.isConfirmed === true) ? false : this.state.isModalVisible}>
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <Title>{(mustLogIn === true) ? "Log In First" : "Email Verification"}</Title>
                    <Text style={{ textAlign: "center", margin: 10 }}>{(mustLogIn === true) ? LogInText : emailText}</Text>
                    <Title>{(ChangeEmail === true) ? email : oldEmail}</Title>
                    <View style={{ justifyContent: "space-between" }}>
                        {form}

                        <Text style={{ textAlign: "center", color: "red" }}>{this.state.warning}</Text>

                        <Text onPress={() => this.sendLink()} style={{ textAlign: "center", color: "blue" }}>{(isLinkSent === true) ? "Send Again" : null}</Text>

                        <Title style={{ marginTop: 20 }}>{this.state.message}</Title>

                        <Button full info style={{ marginTop: 20 }} onPress={() => {
                            this.setState({ warning: "", message: "" })
                            if (isLinkSent) {
                                this.verify();
                            }
                            else if (ChangeEmail) {
                                if (mustLogIn) {
                                    this.login()
                                }
                                else {  
                                    this.updateEmailAssurance();
                                }
                            } else {
                                this.sendLink()
                            }
                        }}>
                            <Text>{(isLinkSent === true) ? "Verify Now" : (mustLogIn === true) ? "Log in" : (ChangeEmail === true) ? "Send Now" : "Send Again"}</Text>

                        </Button>
                        <Title style={{ marginTop: 20 }}>{(ChangeEmail === true || isLinkSent === true) ? "" : "Or"}</Title>
                        {chnageButton}
                    </View>
                </View>
            </Modal>

        );
    }
}

export default Email