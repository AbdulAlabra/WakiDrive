import React, { Component } from 'react';
import { View } from "react-native"
import PhoneNumber from './PhoneNumberVerify'
import Email from "./Email"
import isVerified from "./verifiyUser"

class ShowModal extends Component {
    state = {
        status: "",
        isModalVisible: false
    };
    componentWillMount() {
        this.verify()
    }
    verify() {
        isVerified().then(res => {
            console.log("res " + res)
            this.setState({ status: res })
        })
            .catch(err => {
                console.log(err);
            })
    }
    _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

    show() {
        const { status } = this.state
        if (status === "phone") {
            return <PhoneNumber />
        }
        else if (status === "email") {
            return <Email />
        }
        else {
            return null
        }
    }
    render() {
        return (
            <View>
                {this.show()}
            </View>
            );
    }
}

export default ShowModal