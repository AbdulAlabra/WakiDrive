import React, { Component } from 'react';
import { StyleSheet, ScrollView } from "react-native";
import { Form, Item, Text, Input, Label, Button, Title, View } from 'native-base';
import Modal from "../ActionButton/Modal";
import { NetworkInfo } from 'react-native-network-info';
import paytabs from 'paytabs_api';
import PayPage  from "./Pay";


class Payment extends Component {
    state = {
        isModalVisible: false,
    }
    componentDidMount() {
        console.log("Hello")

    }
    render() {
        const { isModalVisible } = this.state

        return (


            <View style={styles.Container}>
                {/* <Title style={styles.Title}>Hello Payment</Title>
                <View style={styles.PaymentContainer}>

                    <ScrollView contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: "center"
                    }}>


                        <View style={styles.Row}>
                            <View style={styles.PaymentBox}>
                                <Text>Pay 2</Text>
                                <Text>Pay 2</Text>
                                <Text>Pay 2</Text>
                            </View>
                            <View style={styles.PaymentBox}>
                                <Text>Pay 2</Text>
                                <Text>Pay 2</Text>
                                <Text>Pay 2</Text>
                            </View>
                        </View>

                        <View style={styles.Row}>
                            <View style={styles.PaymentBox}>
                                <Text>Pay 2</Text>
                                <Text>Pay 2</Text>
                                <Text>Pay 2</Text>
                            </View>
                            <View style={styles.PaymentBox}>
                                <Text>Pay 2</Text>
                                <Text>Pay 2</Text>
                                <Text>Pay 2</Text>
                            </View>
                        </View>

                        <View style={styles.Row}>
                            <View style={styles.PaymentBox}>
                                <Text>Pay 2</Text>
                                <Text>Pay 2</Text>
                                <Text>Pay 2</Text>
                            </View>
                            <View style={styles.PaymentBox}>
                                <Text>Pay 2</Text>
                                <Text>Pay 2</Text>
                                <Text>Pay 2</Text>
                            </View>
                        </View>
                    </ScrollView>



                </View>

                <Button style={styles.Button} block>
                    <Text>Pay Now</Text>
                </Button> */}
            </View>

        );
    }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        justifyContent: "space-evenly",
    },
    Title: {
        marginTop: 50,
    },
    PaymentContainer: {
        flex: 0.8,
    },
    Row: {
        flexDirection: "row",
        flex: 0.5,  // does not make anyt chaneg
        justifyContent: "space-evenly"

    },
    Button: {
        justifyContent: "center",
        flexDirection: "row",
        flex: 0.08,
        marginTop: 10,
        marginBottom: 30,
    },
    PaymentBox: {
        backgroundColor: "#41c4f4",
        flex: 0.5,
        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: "column",
        margin: 10
    }
})

export default Payment



/*
blue  - backgroundColor: "#41c4f4",

*/
