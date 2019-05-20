
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import { OverallOrder, Money, History } from './helpers'
import Payment from "../payment/Payment";
import Modal from './Modal'


class Button extends Component {
    //rgba(231,76,60,1) red color
    state = {
        isModalVisible: false,
        button: ""
    };
    _toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });

    showThisModal(button) {
        console.log("Hello from show")
        if (button === 'Today') {
            return (
                <Modal color='#097CB9' toggleModal={this._toggleModal} isModalVisible={this.state.isModalVisible}>
                    <Money />
                </Modal>
            )
        }
        else if (button === "Journey") {
            return (
                <Modal color='#9b59b6' toggleModal={this._toggleModal} isModalVisible={this.state.isModalVisible}>
                    <OverallOrder />
                </Modal>
            )
        }
        else if (button === "History") {
            return (
                <Modal color='#1abc9c' toggleModal={this._toggleModal} isModalVisible={this.state.isModalVisible}>
                    <History />
                </Modal>
            )
        }
        else if (button === "Payment") {
            console.log("hello payment")
            return (
                <Modal color='#3498db' toggleModal={this._toggleModal} isModalVisible={this.state.isModalVisible}>
                <Payment />
                </Modal>

            )
        }
    }

    chosenButton(button) {
        this.setState({ isModalVisible: true, button: button });
    }
    render() {

        return (
            <ActionButton buttonColor="#9b59b6"
                autoInactive={false}
                size={70}
                position="center"
            >
                <ActionButton.Item buttonColor='#9b59b6' title="Journey" onPress={() => this.chosenButton("Journey")}>
                    <Icon name="md-create" style={styles.actionButtonIcon} />
                    {this.showThisModal(this.state.button)}
                </ActionButton.Item>

                <ActionButton.Item buttonColor='#3498db' title="Today" onPress={() => this.chosenButton("Today")}>
                    <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
                </ActionButton.Item>

                <ActionButton.Item buttonColor='#1abc9c' title="History" onPress={() => this.chosenButton("History")}>
                    <Icon name="md-done-all" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#3498db' title="Payment" onPress={() => this.chosenButton("Payment")}>
                    <Icon name="md-card" style={styles.actionButtonIcon} />
                </ActionButton.Item>
            </ActionButton>


        );
    }

}
// right:"74%", bottom: '16%'
const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',

    },
});



export default Button