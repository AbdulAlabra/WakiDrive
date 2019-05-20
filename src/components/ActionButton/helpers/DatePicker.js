import React, { Component } from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import { Button, Text, View, Title } from 'native-base';
import moment from 'moment-timezone';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Alert from "../../Alert";
import check from './Check';
import firebase from "../../Firebase";

export default class DateTimePickerTester extends Component {
    state = {
        isDateTimePickerVisible1: false,
        isDateTimePickerVisible2: false,
        from: "",
        to: "",
        totalMoney: 0,
        isDone: false,
        History: [],
    };

    _showDateTimePicker1 = () => this.setState({ isDateTimePickerVisible1: true });
    _hideDateTimePicker1 = () => this.setState({ isDateTimePickerVisible1: false });
    _handleDatePicked1 = (date) => {
        this._hideDateTimePicker1();
        this.convertDate(date, 'from');
    };

    _showDateTimePicker2 = () => this.setState({ isDateTimePickerVisible2: true });
    _hideDateTimePicker2 = () => this.setState({ isDateTimePickerVisible2: false });
    _handleDatePicked2 = (date) => {
        this._hideDateTimePicker2();
        this.convertDate(date, "to");
    };

    convertDate(date, type) {
        let toString = date.toString()
        let chosenDate = toString.split(" ");
        chosenDate.shift();
        chosenDate.length = 3
        let getDate = `${chosenDate[0]} ${chosenDate[1]} ${chosenDate[2]}`
        let formatedDate = moment(getDate, "MMM DD YYYY").format("YYYY-MM-DD")
        if (type === "from") {
            this.setState({ from: formatedDate })
        }
        else {
            this.setState({ to: formatedDate })

        }
    }

    message(title, body) {
        Alert(title, body || "", () => console.log('ok'), () => console.log('cancel'));
    }

    onClick() {
        if (this.state.from === "") {
            this.message("From date is not selceted")
        }
        else if (this.state.to === "") {
            this.message("To date is not selceted")
        }
        else {
            let from = moment(this.state.from, "YYYY-MM-DD")
            let to = moment(this.state.to, "YYYY-MM-DD")
            let now = moment(moment().tz("Asia/Riyadh").format("YYYY-MM-DD"));
            let diffNowTo = now.diff(to, "days");
            let diffNowFrom = now.diff(from, "days");
            let diff = to.diff(from, "days");
            if (diffNowFrom < 0 || diffNowTo < 0) {
                this.message("We are not that smart to predict the future ", "Please choose a date which you were alive in :)")
            }
            else if (Math.abs(diff) > 30) {
                this.message("Sorry .. ", "You cannot choose more than 30 days range");
            }
            else {
                this.setState({ History: [] });

                if (diff === 0) {
                    this.message("To see today's analtics only", "You can go to Today section for quick view ")
                }
                else if (diff > 0) {
                    //if it's (-) that means from date is bigger than the to
                    this.search(this.state.from, this.state.to)
                }
                else {
                    //if it's (+) that means from date is bigger than the to    
                    this.search(this.state.to, this.state.from)
                }
            }
            console.log(Math.abs(diff) + " days range");
            console.log("-------------")

        }
    }

    search(from, to) {
        const db = firebase.database();
        check('driverID')
            .then(driverID => {
                if (driverID) {
                    db.ref(`drivers/registeredDrivers/${driverID}/driverHistory/completedOrders/orders`).orderByKey().startAt(from).endAt(to).once("value", snapshot => {

                    }).then(res => {
                        let result = res.val();
                        // console.log(result)
                        if (result !== null) {


                            res.forEach(thisDay => {
                                let date = <Title>{thisDay.key}</Title>;
                                let numOfOrders = <Title>Total Orders: {thisDay.numChildren()}</Title>;
                                let ordersContent = [];
                                thisDay.forEach(thisOrder => {
                                    let order = thisOrder.val();
                                    // console.log(order.duration)
                                    let duration = <Text>duration: {order.duration}</Text>
                                    let moneyMadeToday = <Text>You Made: {order.moneyMadeToday}$</Text>
                                    let thisOrderInfo = <View style={{
                                        borderBottomColor: 'black',
                                        borderBottomWidth: 0.5,
                                        flexDirection: "row",
                                        justifyContent: "space-around"

                                    }}>
                                        {duration}
                                        {moneyMadeToday}
                                    </View>
                                    ordersContent.push(thisOrderInfo)
                                })

                                let newData = this.state.History;
                                let content = <View style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: 1

                                }}>
                                    {date}
                                    {numOfOrders}
                                    {ordersContent.map(orderInfo => {
                                        return orderInfo
                                    })}

                                </View>
                                newData.push(content)
                                this.setState({ History: newData })
                            })

                            this.setState({ isDone: true })
                        }
                        else {
                            this.message("No Orders within the range you have selcted")
                        }
                    })
                        .catch(err => {
                            console.log(err);
                        })

                }

            })
            .catch(err => {
                console.log(err);
            })
    }
    showContent() {
        if (this.state.isDone) {
            let content = this.state.History.map(information => {
                return information
            })
            return content
        }
    }
    render() {

        return (
            <View style={{ flex: 1 }}>
                <View style={{ marginTop: 40, flexDirection: "row", justifyContent: "space-evenly" }}>
                    <View>
                        <TouchableOpacity onPress={this._showDateTimePicker1}>
                            <Text style={{ fontWeight: 'bold' }}>From {"\n" + this.state.from}</Text>
                        </TouchableOpacity>
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible1}
                            onConfirm={this._handleDatePicked1}
                            onCancel={this._hideDateTimePicker1}
                        />
                    </View>
                    <View>
                        <TouchableOpacity onPress={this._showDateTimePicker2}>
                            <Text style={{ fontWeight: 'bold' }}>To {"\n" + this.state.to}</Text>
                        </TouchableOpacity>
                        <DateTimePicker
                            isVisible={this.state.isDateTimePickerVisible2}
                            onConfirm={this._handleDatePicked2}
                            onCancel={this._hideDateTimePicker2}
                        />
                    </View>

                </View>
                <Button style={{ margin: 10 }} onPress={() => this.onClick()} full bordered dark>
                    <Text>Check</Text>
                </Button>
                <ScrollView>
                    {this.showContent()}
                </ScrollView>
            </View>

        );
    }

}