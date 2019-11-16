import React, { Component } from 'react';
import { View } from "react-native"
import PhoneNumber from './PhoneNumberVerify'
import Email from "./Email"
import Address from './Address'
import isVerified from "./verifiyUser"
import userInformation from "../Account/updatedUserInformation"
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
    setStatus(status) {
        this.setState({ status })

    }
    verify() {
        userInformation()
            .then((user) => {
                if (user) {


                    const { address, phone, email_verified } = user.claims
                    if (!phone) {
                        this.setStatus("phone");
                    }
                    else if (!email_verified) {
                        this.setStatus("email")
                    }
                    else if (!address) {
                        this.setStatus("address")
                    }
                }
                else {
                    this.setState({ status: "" })
                }
            })
            .catch(err => {
                console.log(err)
                return false
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
        }
        else if (status === "address") {
            return <Address onComplete={() => this.verify()} />
        }
        else if (status === "payment") {
            return <Payment />
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