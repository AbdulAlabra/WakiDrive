import React, { Component } from 'react';
import { Container, Form, Item, Text, Input, Label, Button, Title, Footer } from 'native-base';
import SideMenu from '../screens/Menu';
import Header from './Header'
import Modal from "./Modal"
import ValidateForm from "./FormValidatiom"
import firebase from "./Firebase"
import { Dimensions, StyleSheet } from "react-native"

const { width, height } = Dimensions.get('window');

class SignUpForm extends Component {
  state = {
    isOpen: false,
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: ""
  };
  static navigationOptions = {
    header: null
  }

  updateUserProfireWithGoogle() {
    var user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: this.state.firstName,
      photoURL: "not",
      hhhh: "hhhd"
    })
      .then(() => {
        console.log(user);
        this.setState({
          isOpen: false,
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          phone: ""
        });
      })
      .catch(function (error) {
        console.log(error);
      });

  }
  returnStyles() {
    console.log(height)
    if (height >= 812) {
      return { marginBottom: "20%" }
    }
    else if ( height >= 736 && height < 812) {
      return { marginBottom: "10%" }
    }
  else {
    return { marginBottom: "4%" }
  }
}
  titleStyle() {
   if (height >= 812 && height < 896) {
     //iphone x
     console.log('iphone x')
     return { marginTop: "10%", marginBottom: "5%" }
   }
   else if (height >= 896) {
     console.log('iphone max')
     //iphone X Max
     return { marginTop: "10%", marginBottom: "10%" }
   }
   // iphone 8 plus 736
   else {
     console.log('small iphone')
    return { marginTop: "5%", marginBottom: "5%" }
   }
  }
  render() {
    const { firstName, lastName, phone, email, password } = this.state;
    return (

      <SideMenu isOpen={this.state.isOpen}>
        <Container>
          <Header
            title="WakiDrive"
            rightIconName="location"
            leftIconName="ios-menu"
            iconSize={30}
            onPressTitle={() => this.props.navigation.navigate('Home')}
            onPressRight={() => this.props.navigation.navigate('Home')}
            onPressLeft={() => this.setState({ isOpen: true })}
          />

          <Title style={this.titleStyle()} >Sign Up & Drive Now!</Title>

          <Modal
            TextToShow={'log in if you have an account'}
          />
          <Form style={this.returnStyles()}>
            <Item style={{ marginTop: "10%" }} fixedLabel>
              <Label>First Name</Label>
              <Input
                value={this.state.firstName}
                onChangeText={firstName => this.setState({ firstName, isOpen: false })}
              />
            </Item>

            <Item style={{ marginTop: "10%" }} fixedLabel last>
              <Label>Last Name</Label>
              <Input
                value={this.state.lastName}
                onChangeText={lastName => this.setState({ lastName, isOpen: false })}
              />
            </Item>

            <Item style={{ marginTop: "10%" }} fixedLabel last>
              <Label>Phone</Label>
              <Input
                value={this.state.phone}
                onChangeText={phone => this.setState({ phone, isOpen: false })}
              />

            </Item>
            <Item style={{ marginTop: "10%" }} fixedLabel last>
              <Label>Email</Label>
              <Input
                value={this.state.email}
                onChangeText={email => this.setState({ email, isOpen: false })}
              />

            </Item>
            <Item style={{ marginTop: "10%" }} fixedLabel last>
              <Label>Password</Label>
              <Input
                value={this.state.password}
                onChangeText={password => this.setState({ password, isOpen: false })}
                secureTextEntry={true}
              />
            </Item>
          </Form>
          <Button full info style={{ height: '10%' }} onPress={() => {
            ValidateForm(firstName, lastName, phone, email, password, (userId) => this.updateUserProfireWithGoogle());
          }}>
            <Text>Submit</Text>
          </Button>
        </Container>
      </SideMenu>
    );
  }
}
export default SignUpForm