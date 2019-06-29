import React, { Component } from 'react';
import { Container, Form, Item, Text, Input, Label, Button, Title, Footer, View } from 'native-base';
import SideMenu from '../screens/Menu';
import Header from './Header'
import Modal from "./Modal"
import ValidateForm from "./FormValidatiom"
import firebase from "./Firebase"
import { Dimensions, Keyboard, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Modal2 from './ActionButton/Modal'
import PhoneNumber from "./verifyUserInfo/PhoneNumberVerify"
import verifyUser from './verifyUserInfo/verifiyUser'
const { height } = Dimensions.get('window');

class SignUpForm extends Component {
  state = {
    isOpen: false,
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    contryCode: "+966",
    acctStatus: "",
    userId: false,
    isModalVisible: false,
    warning: ""

  };
  static navigationOptions = {
    header: null
  }

  componentWillMount() {
    verifyUser().then(res => {

      this.setState({ acctStatus: res });
    }).catch(err => {
      console.log(err);
    })
  }
  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  updateUserProfireWithGoogle(userId) {
    var user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: this.state.firstName,
      photoURL: "not",
    })
      .then(() => {

        this.setState({
          isOpen: false,
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          phone: "",
          isModalVisible: true,

        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  returnStyles() {

    if (height >= 812) {
      return { marginBottom: "20%" }
    }
    else if (height >= 736 && height < 812) {
      return { marginBottom: "10%" }
    }
    else {
      return { marginBottom: "4%" }
    }
  }
  titleStyle() {
    if (height >= 812 && height < 896) {
      //iphone x
      return { marginTop: "10%", marginBottom: "5%" }
    }
    else if (height >= 896) {
      //iphone X Max
      return { marginTop: "10%", marginBottom: "10%" }
    }
    // iphone 8 plus 736
    else {
      return { marginTop: "5%", marginBottom: "5%" }
    }
  }
  focusFiled(x) {
    let prev = x.split("")
    let fieldNum = Number(prev[1]) + 1
    let field = `f${fieldNum.toString()}`
    field.focus()
  }
  form() {
    if (this.state.acctStatus !== "acct") { // need to change to ===
      return (
        <ScrollView>

          <Form style={this.returnStyles()}>
            <Item style={{ marginTop: "10%" }} fixedLabel>
              <Label>First Name</Label>
              <Input
                label={"f1"}
                blurOnSubmit={false}
                returnKeyType={"next"}
                value={this.state.firstName}
                // onSubmitEditing={() => this.focusFiled("f1")}
                onChangeText={firstName => this.setState({ firstName, isOpen: false })}
              />
            </Item>

            <Item style={{ marginTop: "10%" }} fixedLabel last>
              <Label>Last Name</Label>
              <Input

                blurOnSubmit={false}
                label={"f2"}
                returnKeyType={"next"}
                value={this.state.lastName}
                onChangeText={lastName => this.setState({ lastName, isOpen: false })}
              />
            </Item>

            <Item style={{ marginTop: "10%" }} fixedLabel last>
              <Label>Phone</Label>
              <Input
                blurOnSubmit={false}

                label={"f3"}
                returnKeyType={"next"}
                value={this.state.phone}
                onChangeText={phone => this.setState({ phone, isOpen: false })}
              />

            </Item>
            <Item style={{ marginTop: "10%" }} fixedLabel last>
              <Label>Email</Label>
              <Input
                label={"f4"}
                returnKeyType={"next"}
                value={this.state.email}
                onChangeText={email => this.setState({ email, isOpen: false })}
              />

            </Item>
            <Item style={{ marginTop: "10%" }} fixedLabel last>
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
        </ScrollView>

      )
    }
  }
  button(firstName, lastName, phone, email, password) {
    if (this.state.acctStatus === "acct") { // change to !==
      return (

        <Button full info style={{ height: '10%' }} onPress={() => {
          this.setState({ isModalVisible: true });
        }}>
          <Text>Complete Registration</Text>
        </Button>

      )
    }
    else {
      return (
        <Button full info style={{ height: '10%' }} onPress={() => {
          let user = firebase.auth().currentUser
          console.log(user);
          ValidateForm(firstName, lastName, phone, email, password, (userId) => {
            this.updateUserProfireWithGoogle()
          });
        }}>
          <Text>Submit</Text>
        </Button>
      )
    }
  }
  render() {

    const { firstName, lastName, phone, email, password, userId } = this.state;

    return (
      <SideMenu isOpen={this.state.isOpen}>
        <KeyboardAwareScrollView
          style={{ backgroundColor: '#4c69a5' }}
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled={false}
        >
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
              <Modal2 color='#9b59b6' toggleModal={this._toggleModal} isModalVisible={this.state.isModalVisible} >
                <PhoneNumber acctStatus={this.state.acctStatus} />
              </Modal2 >
              {this.form()}
              {this.button(firstName, lastName, phone, email, password)}
            </Container>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>

      </SideMenu>

    );
  }
}
export default SignUpForm