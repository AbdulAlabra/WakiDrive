import React, { Component } from 'react';
import { View } from "react-native"
import PhoneNumber from './PhoneNumberVerify'
import Email from "./Email"
import Address from './Address'
import isVerified from "./verifiyUser"

import Payment from "./Payment"


/*
there is an error in this file
ExceptionsManager.js:82 Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.
in ShouldPay (at ShowModal.js:51)
*/

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