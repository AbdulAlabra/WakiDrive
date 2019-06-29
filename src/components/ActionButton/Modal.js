import React, { Component } from "react";
import { StyleSheet, Modal } from "react-native";
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
            <Modal
                animationType="slide"
                transparent={true}
                animated={true}
                visible={this.props.isModalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                <View style={{ flex: 1, backgroundColor: this.props.color }}>
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
        marginBottom: 10,
        // height: 22,
        color: '#FAFAFA',

    },
})

