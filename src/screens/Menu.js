import React, { Component } from "react"
import MenuContent from "./MenuContent";
import SideMenu from "../components/SideMenu"
import { withNavigation } from 'react-navigation';
// import { NavigationActions } from 'react-navigation';

class Menu extends Component {
    state = {
        isOpen: false
    }
    render() { 
        const content = <MenuContent 
        isItOpen={this.props.isItOpen}
        signUp={() => {
            isOpen=false
            this.setState({ isOpen: this.props.isItOpen })
            this.props.navigation.navigate('SignUpForm')
            // NavigationActions.navigate('SignUpForm')
        }}
        home={() => {
            this.setState({ isOpen: this.props.isItOpen })
            this.props.navigation.navigate('Home')
        }}
        profile={() => {
            this.setState({ isOpen: this.props.isItOpen })
            this.props.navigation.navigate('SignUp')
        }}
        settings={() => {
            this.setState({ isOpen: this.props.isItOpen })
            this.props.navigation.navigate('SignUp')
        }}
        />
        return ( 
            <SideMenu menu={content} isOpen={this.props.isOpen}>
            {this.props.children}
            </SideMenu>
         );
    }
}
 
export default withNavigation(Menu);

// export default Menu;


