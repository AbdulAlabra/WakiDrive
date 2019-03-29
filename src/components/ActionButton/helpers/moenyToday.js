import React, { Component } from "react";
import { StyleSheet, ScrollView } from "react-native";
import check from './Check'
import firebase from '../../Firebase'
import { Text, Title, View, } from "native-base";
import moment from "moment-timezone"

export default class Money extends Component {
    state = {
        details: "",
        total: "",
        title: 'No Money Has been Made',
        moneyMadeToday: 0,
        orders: [],
        isModalVisible: false,
    }
    componentDidMount() {
        this.driverID();
    }
    _toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });
    driverID() {
        check('driverID').then(driverID => {
            if (driverID) {
                this.money(driverID)
            }
            else {

            }
        })
            .catch(e => {
                console.log(e);
                return false
            })
    }
    money(driverID) {
        console.log(driverID)

        const db = firebase.database()
        let today = moment().tz('Asia/Riyadh').format('YYYY-MM-DD');
        console.log(today);
        db.ref(`drivers/registeredDrivers/${driverID}/driverHistory/completedOrders/orders/${today}`).once('value', function (snapshot) {
        })
            .then(details => {
                let result = details.val()

                console.log(result);
                if (result) {
                    let numberOfOrders = (details.numChildren() === 1) ? details.numChildren() + " order" : details.numChildren() + " orders";
                    this.setState({ title: "This is What You have Made Today!", total: numberOfOrders });

                    details.forEach(child => {
                        let order = child.val()
                        let deliveredAt = <Text>delivered on: <Text style={{ fontWeight: 'bold' }}>{order.deliveredAt}</Text></Text>;
                        let assignedAt = <Text>assignedAt: {order.assignedAt}</Text>;
                        let duration = <Text >duration: {order.duration}</Text>
                        let moneyMadeToday = <Text><Text style={{ fontWeight: 'bold' }}>You Made: </Text><Text style={{ color: '#69FF99' }}>{order.moneyMadeToday}$</Text></Text>
                        let showOrder = <View key={child.key} style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                            justifyContent: "space-evenly"
                        }}>
                            {assignedAt}
                            {deliveredAt}
                            {duration}
                            {moneyMadeToday}
                        </View>
                        let newArr = this.state.orders
                        newArr.push(showOrder)
                        this.setState({
                            moneyMadeToday: order.moneyMadeToday + this.state.moneyMadeToday,
                            orders: newArr
                        })

                    })
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
    showContent() {
        if (this.state.orders.length > 0) {
            let content = this.state.orders.map(order => {
                return order
            })
            return content
        }
    }

    render() {
        return (
            <View style={styles.View} >
                <View style={{marginTop: 20}}>
                    <Title style={styles.money}>{this.state.moneyMadeToday}$</Title>
                    <Title >{this.state.total}</Title>
                    <Title>{this.state.title}</Title>
                </View>
                <ScrollView style={{margin:10}}>

                {this.showContent()}
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    Title: {
        justifyContent: "center"
    },
    money: {
        fontSize: 30,
        color: '#69FF99'
    },
    Text: {
        // justifyContent: "center",
        textAlign: "justify"
    },
    order: {
        // flex: 1,
        justifyContent: "space-around",

    },
    View: {
        flex: 1,
        justifyContent: "space-evenly",
    }
})

/*
good green
color: '#0FFD5B'
 color: '#26EA65'
 #1ABC9C
*/