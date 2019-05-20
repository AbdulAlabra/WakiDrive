import React, { Component } from "react";

// import check from './Check'
// import firebase from '../../Firebase'
// import { Text, Title, View } from "native-base";
// import moment from "moment-timezone"
import DatePicker from './DatePicker'

export default class Money extends Component {
    state = {
        from: "",
        to: ""
    }
    componentWillMount() {
        console.log("this.state.from " + this.state.from)
        console.log('this.state.to' + this.state.to)
    }

    render() {
        return (

            <DatePicker
            />
        )
    }
}


