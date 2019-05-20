import React, { Component } from "react";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { View } from "native-base";
import Icon from 'react-native-vector-icons/Ionicons';


export default class ModalTester extends Component {
    state = {
        isModalVisible: this.props.isModalVisible,
        swipe: false
    };
    _toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });

    render() {
        return (
            <Modal backdropOpacity={0.9} backdropColor={this.props.color} isVisible={this.props.isModalVisible}>
                <View style={{ flex: 1 }}>
                    {this.props.children}
                    <Icon name="md-close" onPress={this.props.toggleModal} style={styles.actionButtonIcon} />
                </View>
            </Modal>

        );
    }
}

// #1ABC9C green color

const styles = StyleSheet.create({
    Exsit: {
        margin: 10,
    },
    actionButtonIcon: {
        textAlign: "center",
        fontSize: 70,
        // height: 22,
        color: '#FAFAFA',

    },
})

