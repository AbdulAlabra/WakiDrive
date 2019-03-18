 import React, { Component } from 'react';
import SideMenu from 'react-native-side-menu';
import { Container } from 'native-base';
import { TouchableWithoutFeedback } from "react-native"

class Menu extends Component {
  static navigationOptions = {
    header: null
  }
    render() {
      return (
        <TouchableWithoutFeedback onPress={this.props.onPress}> 
        <Container>

          <SideMenu menu={this.props.menu} isOpen={this.props.isOpen} >
          {this.props.children}
          </SideMenu>

        </Container>
        </TouchableWithoutFeedback>
      );
    }
  }
  export default Menu
