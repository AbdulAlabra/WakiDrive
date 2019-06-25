import React, { Component } from "react";
import { StyleSheet } from "react-native";
import orderDetails from '../../orders/orderDetails'
import check from './Check'
import { Text, Title, View, } from "native-base";


export default class OverallOrder extends Component {
    state = {
        details: "",
        total: "",
        title: 'No Orders'

    }
    componentWillMount() {
        this.order();
    }
    order() {
        check('currentOrder').then(order => {
            if (order) {
                orderDetails(order)
                    .then(details => {
                        let orderDetails = details.orderDetails
                        let name = details.name
                        let total = (details.total === 1) ? details.total + " Item" : details.total + " Items"

                        if (details.total) {
                            this.setState({ details: orderDetails, title: name, total: total })
                        }
                        else {
                            this.setState({ details: orderDetails, title: name })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        return false
                    })
            }
            else {
                console.log('No order')
                console.log(order);
            }
        })
            .catch(e => {
                console.log(e);
                return false
            })
    }

    render() {
        return (
            <View style={styles.View} >
                <Title>{this.state.title}</Title>
                <Title>{this.state.total}</Title>
                <Text style={styles.Text}>{this.state.details}</Text>

            </View>

        )
    }
}


const styles = StyleSheet.create({
    Title: {
        justifyContent: "center"
    },
    Text: {
        // justifyContent: "center",
        textAlign: "justify"
    },
    View: {
        flex: 1,
        justifyContent: "center"
    }
})


