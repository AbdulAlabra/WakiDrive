import React, { Component } from 'react';
import { StyleSheet, ScrollView, Linking, Dimensions } from "react-native";
import { Form, Item, Text, Input, Label, Button, Title, View } from 'native-base';
import firebase from "../Firebase"
import localStorage from "../localStorage"
import moment from 'moment-timezone'
import Config from "react-native-config"


const { width } = Dimensions.get('window');

class Payment extends Component {
    state = {
        isModalVisible: false,
        notPaid: [],
        driverMoney: [],
        PayPage: [],
        WakiDriveTotal: 0,
        driverTotal: 0,
        driverID: false
    }

    componentDidMount() {
        this.notPaidDeatils()
    }
    notPaidDeatils() {
        localStorage.retrieveData("@driverID")
            .then(driverID => {

                firebase.database().ref(`drivers/registeredDrivers/${driverID}/driverHistory/payment`).once("value", snap => {

                }).then(res => {
                    const data = res.val()
                    console.log(data)
                    if (data !== false || data !== null) {
                        this.setState({ driverID })
                        const notPaid = () => {
                            let x = 0
                            let paymentDeatils = []
                            let numOfPayments = res.child("notPaid/current/payments").numChildren();
                            let total = res.child("notPaid/current/total").val()
                            console.log(numOfPayments)
                            if (numOfPayments > 0) {
                                res.child("notPaid/current/payments").forEach(payment => {
                                    x++
                                    const details = payment.val()
                                    let commission = details.commission
                                    let deliveryCost = details.deliveryCost
                                    let driverMoney = details.driverMoney
                                    let time = moment(details.time, "YYYY-MM-DDTHH:mm:ss").format("LLL")
                                    let paymentView = <View key={payment.key} style={styles.PaymentBoxWaki}>
                                        <Text style={styles.Date}>Date: {time}</Text>
                                        <Text style={styles.deliveryCost}>Delivery Cost: {deliveryCost} SAR</Text>
                                        <Text style={styles.commission}>Commission: {commission} SAR</Text>
                                        <Text style={styles.driverMoney}>Your Moeny: {driverMoney}</Text>
                                    </View>
                                    paymentDeatils.push(paymentView)
                                    if (x === numOfPayments) {
                                        this.setState({ notPaid: paymentDeatils, WakiDriveTotal: total })
                                        driverMoneyDetails()
                                    }
                                })
                            }
                            else {
                                driverMoneyDetails()
                                // no payments get
                                // check If there is any PayPages
                            }
                        }
                        const PayPage = () => {
                            let numberOfPages = res.child("PayPages").numChildren()
                            let pages = res.child("PayPages")
                            let pagesDetailsView = [];
                            console.log("numberOfPages :" + numberOfPages)
                            if (numberOfPages > 0) {
                                let x = 0
                                pages.forEach(page => {
                                    const PayPageUrl = (url) => {
                                        console.log("I Should Open URL")
                                        Linking.openURL(url)
                                            .then(res => {
                                                console.log(res)
                                            })
                                            .catch(err => {
                                                console.log(err)
                                            })
                                    }
                                    x++
                                    let PayPageDetails = page.val()
                                    let DriverCommission = PayPageDetails.DriverCommission
                                    let driverTotalOrders = DriverCommission.total


                                    let WakiDriveCommission = PayPageDetails.WakiDriveCommission
                                    let WakiDriveTotal = WakiDriveCommission.total
                                    let url = PayPageDetails.PayPage.payment_url
                                    let pageView = <View key={x} onPress={() => console.log("Hellloooo")} style={styles.PaymentBoxWaki}>
                                        <Text style={styles.deliveryCost}>WakiDrive Commission: {WakiDriveTotal} SAR</Text>
                                        <Text style={styles.commission}>Your Commission: {driverTotalOrders} SAR</Text>

                                        <Text style={styles.driverMoney}>Total Fee = {WakiDriveTotal} SAR - {driverTotalOrders} SAR = {Math.abs(WakiDriveTotal - driverTotalOrders)}
                                        </Text>
                                        <Button onPress={() => PayPageUrl(url)} style={{ alignSelf: "center" }}>
                                            <Text>Pay Now</Text>
                                        </Button>

                                    </View>
                                    pagesDetailsView.push(pageView)
                                    console.log(WakiDriveTotal)
                                    if (x === numberOfPages) {
                                        this.setState({ PayPage: pagesDetailsView })
                                    }
                                })


                            }
                            else {
                                return false
                            }
                        }
                        const driverMoneyDetails = () => {
                            let x = 0
                            let paymentDeatils = []
                            let numOfPayments = res.child("paymentToDriver/current/payments").numChildren();
                            let total = res.child("paymentToDriver/current/total").val()

                            if (numOfPayments > 0) {
                                res.child("paymentToDriver/current/payments").forEach(payment => {
                                    x++
                                    const details = payment.val()
                                    console.log(details)
                                    let commission = details.commission
                                    let deliveryCost = details.deliveryCost
                                    let driverMoney = details.driverMoney
                                    let time = moment(details.time, "YYYY-MM-DDTHH:mm:ss").format("LLL")
                                    let paymentView = <View key={payment.key} style={styles.PaymentBoxDriver}>
                                        <Text style={styles.Date}>Driver Date: {time}</Text>
                                        <Text style={styles.deliveryCost}>Delivery Cost: {deliveryCost} SAR</Text>
                                        <Text style={styles.commission}>Commission: {commission} SAR</Text>
                                        <Text style={styles.driverMoney}>Your Moeny: {driverMoney}</Text>

                                    </View>
                                    paymentDeatils.push(paymentView)
                                    if (x === numOfPayments) {
                                        this.setState({ driverMoney: paymentDeatils, driverTotal: total })
                                    }
                                })
                            }
                        }

                        notPaid()
                        PayPage()
                    }
                    else {
                        return null
                    }
                })
            })
            .catch(err => {
                console.log(err)
                return null
            })
    }

    makeThePayment() {
        fetch("https://us-central1-wakidrive-production.cloudfunctions.net/PayTabsRequest", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({ key: Config.GOOGLE_KEY, driverID: this.state.driverID })
        }).then(res => {

            res.json().then(data => {
                let status = data.status

                if (status === "Approved") {
                    //data.payment_url

                    Linking.openURL(data.payment_url)
                        .then(res => {
                            console.log(res)
                        })
                        .catch(err => {
                            console.log(err)

                        })
                }

                console.log(data)
            })
                .catch(err => {
                    console.log(err)
                })
        })
            .catch(err => {
                console.log(err)

            })
    }
    render() {
        const { WakiDriveTotal, driverTotal, notPaid, driverMoney } = this.state
        let WakiDriveTotalView = null
        let driverTotalView = null

        if (WakiDriveTotal > 0) {
            WakiDriveTotalView = <View key={"wakiTotal"} style={styles.WakiTotalBox}>
                <Title>WakiDrive Earnings</Title>
                <Title>Total: {WakiDriveTotal} SAR</Title>
                <Title>For {notPaid.length} orders</Title>
            </View>
        }
        if (driverTotal > 0) {
            driverTotalView = <View key={"driverTotal"} style={styles.DriverTotalBox}>
                <Title>Your Earnings</Title>

                <Title>Total: {driverTotal} SAR</Title>
                <Title>For {driverMoney.length} orders</Title>
            </View>
        }
        return (
            <View style={styles.Container}>
                <Title style={styles.Title}>{(driverTotal - WakiDriveTotal < 0) ? "Payment " + Math.abs(Number(driverTotal - WakiDriveTotal)) + " SAR" : (driverTotal - WakiDriveTotal === 0) ? "No Payment" : "We will pay you " + Math.abs(Number(driverTotal - WakiDriveTotal)) + " SAR very soon"}</Title>
                <View style={styles.PaymentContainer}>
                    {/* driver Money */}

                    <ScrollView
                        horizontal={true}
                        decelerationRate={0}
                        // snapToInterval={100} //your element width
                        snapToAlignment={"center"}
                        contentContainerStyle={{
                            // flexGrow: 1,
                            justifyContent: "center"
                        }}>
                        <View key={"driverMoney"} style={styles.Row}>
                            {driverTotalView}
                            {this.state.driverMoney.map(payment => {
                                return payment
                            })}
                        </View>

                    </ScrollView>

                    {/* waki Money */}
                    <ScrollView
                        horizontal={true}
                        decelerationRate={0}
                        // snapToInterval={200} //your element width
                        // snapToAlignment={"center"}
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: "space-evenly"
                        }}>
                        <View key={"WakiDriveMoney"} style={styles.Row}>
                            {WakiDriveTotalView}

                            {this.state.notPaid.map(payment => {
                                return payment
                            })}
                        </View>

                    </ScrollView>
                    <ScrollView
                        horizontal={true}
                        decelerationRate={0}
                        // snapToInterval={200} //your element width
                        // snapToAlignment={"center"}
                        contentContainerStyle={{
                            // flexGrow: 1,
                            justifyContent: "space-evenly"
                        }}>
                        <View style={styles.Row}>

                            {this.state.PayPage.map(payment => {
                                return payment
                            })}
                        </View>

                    </ScrollView>


                </View>
                {(driverTotal - WakiDriveTotal < 0) ? <Button onPress={() => this.makeThePayment()} style={styles.Button} block>
                    <Text>Pay {Math.abs(Number(driverTotal - WakiDriveTotal))} SAR Now</Text>
                </Button> : null}

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
        flex: 1,  // does not make anyt chaneg
        justifyContent: "space-evenly"

    },
    Button: {
        justifyContent: "center",
        flexDirection: "row",
        flex: 0.08,
        marginTop: 10,
        marginBottom: 30,
    },
    PaymentBoxDriver: {
        backgroundColor: "#42f4b9",
        flex: 0.5,
        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: "column",
        margin: 10,
        padding: 10
    },
    PaymentBoxWaki: {
        backgroundColor: "#f48c41",
        flex: 0.5,
        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: "column",
        margin: 10,
        padding: 10
    },
    WakiTotalBox: {
        backgroundColor: "#ff5e5e",
        // flex: 0.5,
        width: width * 0.95,
        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: "column",
        margin: 10,
        padding: 10
    },
    DriverTotalBox: {
        //        backgroundColor: "#05c8ff",
        backgroundColor: "#42f595",

        // flex: 0.5,
        width: width * 0.95,

        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: "column",
        margin: 10,
        padding: 10
    },
    commission: {

    },
    deliveryCost: {

    },
    driverMoney: {

    },
    Date: {

    }
})

export default Payment



/*
blue  - backgroundColor: "#41c4f4",

*/
