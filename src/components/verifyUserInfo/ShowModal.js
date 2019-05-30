import React, { Component } from 'react';
import { View } from "react-native"
import PhoneNumber from './PhoneNumberVerify'
import Email from "./Email"
import Address from './Address'
import isVerified from "./verifiyUser"

import Payment from "./Payment"
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
    componentDidUpdate() {
        console.log("I updated")
    }



    _toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });

    show() {
        const { status } = this.state
        if (status === "phone") {
            return <PhoneNumber onComplete={() => this.verify()}
            />
        }
        else if (status === "email") {
            return <Email onComplete={() => this.verify()}
            />
            //  <Email /> this should be like that
        }
        else if (status === "address") {
            return <Address onComplete={() => this.verify()} />
        }
        else {
            console.log("payment should run ")
            return <Payment />
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