import React, { Component } from 'react'
import Modal from "../ActionButton/Modal"
import Payment from "../payment/Payment"
import localStorage from "../localStorage"
import firebase from '../Firebase';



class ShouldPay extends Component {
    state = {
        shouldPay: false,
        isModalVisible: false
    }
    componentWillMount() {
        this.driverShouldPay()
    }
    _toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });
    driverShouldPay() {
        localStorage.retrieveData("@driverID")
            .then(driverID => {
                if (driverID) {
                    firebase.database().ref(`drivers/registeredDrivers/${driverID}/driverStatus/restrictions/isRestricted`).on("value", snapshot => {
                        let isRestricted = snapshot.val()
                        console.log("isRestricted :" + isRestricted)
                        if (isRestricted === true) {
                            snapshot.ref.parent.child("reason").once("value", snapshot => {
                            }).then(res => {
                                let reason = res.val()
                                console.log(reason)
                                let type = reason.type
                                let message = reason.message
                                let issuedDate = reason.issuedDate
                                let references = reason.references
                                let isResolved = reason.isResolved
                                let resolvedDate = reason.resolvedDate
                                let deatils = { type, message, issuedDate, references }


                                if (type === "payment") {
                                    this.setState({ isModalVisible: true })

                                }
                            }).catch(err => {
                                console.log(err)
                            })
                        }
                        else {
                            this.setState({ isModalVisible: false })
                            
                        }
                    });
                }
                else {
                    return false
                }
            })
            .catch(err => {
                console.log(err)
                return false
            })
    }
    render() {
        return (
            <Modal color='#9b59b6' toggleModal={this._toggleModal} isModalVisible={this.state.isModalVisible} >
                <Payment />
            </Modal>
        );
    }
};
export default ShouldPay