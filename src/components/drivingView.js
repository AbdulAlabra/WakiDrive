import React, { Component } from "react";
import { Title, Button, Left, Right, Text, Container } from 'native-base';
import Header from './Header'

class DrivingView extends Component {
    render() {
        const { journeyDetails } = this.props;
        return (
                <Header
                    title={"driving view"}
                    // rightIconName="car"
                    // rightIconColor={}
                    iconSize={30}
                    onLongPressRight={() => console.log("working")}
                    onPressTitle={() => console.log("working")}
                    onPressRight={() => console.log("working")}
                    onPressLeft={() => console.log("working")}
                    onLongPressTitle={() => console.log("working")}
                />


        );
    }
}

export default DrivingView