import React, { Component } from "react";
import { Container, Text, Button, Left, Header, Footer } from 'native-base';
import { StyleSheet } from 'react-native'
// import Icon from 'react-native-vector-icons/AntDesign';
import firebase from "../components/Firebase"
import Modal from '../components/Modal'

class SideMenu extends Component {
    isUserLoggedIn() {
        const user = firebase.auth().currentUser;
        if (user !== null) {
            return (
                <Button style={{ height: '100%', width: '100%' }} full block info onPress={() => {
                    console.log(firebase.auth().currentUser)
                    firebase.auth().signOut().then(() => console.log("user signed out"))
                }}>
                    <Text style={styles.textStyle}>Log Out</Text>
                </Button>
            );

        }
        else {
            return (
                    <Modal
                     TextToShow={'Sign In'} 
                     />
            );

        }

    }
    render() {
        return (
            <Container isButtonPressed={this.props.isButtonPressed} style={{ backgroundColor: "#b3daff" }}>
                <Header style={styles.headerStyle}>
                    <Text style={styles.textStyle}>Logged In User info</Text>
                </Header>

                <Container style={styles.buuttonContainer}>
                    <Button full light iconLeft onPress={this.props.signUp} >
                        {/* <Icon name="adduser" size={20} /> */}
                        <Text>Sign Up</Text>
                    </Button>

                    <Button full light iconLeft onPress={this.props.home} >
                        {/* <Icon name="adduser" size={20} /> */}
                        <Text>Home</Text>
                    </Button>

                    <Button full light iconLeft onPress={this.props.profile} >
                        {/* <Icon name="adduser" size={20} /> */}
                        <Text>Profile</Text>
                    </Button>

                    <Button full light iconLeft onPress={this.props.settings}>
                        {/* <Icon name="adduser" size={20} /> */}
                        <Text>Settings</Text>
                    </Button>
                </Container>

                <Footer style={styles.footerStyle} >
                    {this.isUserLoggedIn()}
                </Footer>

            </Container>
        );
    }
}

export default SideMenu

const styles = StyleSheet.create({
    buuttonContainer: {
        backgroundColor: "#cce6ff",
        justifyContent: 'space-between'
    },
    headerStyle: {
        marginTop: 100,
        backgroundColor: '#b3daff',
        borderBottomColor: "gray"
    },
    footerStyle: {
        backgroundColor: '#b3daff'

    },
    textStyle: {
        textAlign: "center",

    }
});