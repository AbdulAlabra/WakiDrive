// TEST For Notification ... Maybe it's not needed
import React, { Component } from 'react';
import RNFirebase from 'react-native-firebase';
import { Text } from 'native-base';
import Alert from '../Alert'
import firebase from '../Firebase';
var isOnAppNotification = false;

 class Notification extends Component {

    async componentDidMount() {
        // this.checkPermission();
        // this.createNotificationListeners(); //add this line

    }
    
    ////////////////////// Add these methods //////////////////////

    //Remove listeners allocated in createNotificationListeners()
    // componentWillUnmount() {
    //     this.createNotificationListeners();
    //     // this.notificationListener();
    //     // this.notificationOpenedListener();
    // }

    async createNotificationListeners() {

        /*
        * Triggered when a particular notification has been received in foreground
        * */
        // this.notificationListener = RNFirebase.notifications().onNotification((notification) => {
        //     isOnAppNotification = true;
        //     const { title, body } = notification;
        //     // const {orderID, test } = notification.data;
        //     console.log(title);
        //     console.log(body);
        //     this.showAlert('foreground', 'foreground');
        // });

        // /*
        // * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        // * */
        // this.notificationOpenedListener = RNFirebase.notifications().onNotificationOpened((notificationOpen) => {
        //     const { title, body } = notificationOpen.notification;
        //     // const {orderID, test } = notificationOpen.data;

        //     console.log(title)
        //     console.log(body);
        //     this.showAlert("background", 'background')

        // });

        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        // const notificationOpen = await RNFirebase.notifications().getInitialNotification();
        // console.log(notificationOpen);
        // if (notificationOpen) {
        //     const { title, body } = notificationOpen.notification;
        //     // const { orderID, test } = notificationOpen.data;
        //     console.log(title)
        //     console.log(body);
        //     this.showAlert(title, 'getInitialNotification')
        // }
        /*
        * Triggered for data only payload in foreground
        * */

        this.messageListener = RNFirebase.messaging().onMessage((message) => {
            //     // if (isOnAppNotification) {
            //     //     this.showAlert('OnMessge Did not run', "because we already showd the notification in isOnAppNotification");
            //     // }

            this.showAlert('onMessege', 'onMessege')

            //     // const data = message.data;
            //     // const orderID = data.orderID
            //     // const test = data.test
            //     console.log(message);
            //     // firebase.database().ref('test').set({
            //     //     orderID,
            //     //     test
            //     // }
            //     // ).then(() => console.log('success')).catch(err => console.log(err));

        });
    }

    showAlert(title, body) {
        Alert(title, body, () => console.log('ok'), () => console.log('cancel'))
    }
    render() {
        return (
            <Text>Hello</Text>
        )
    }
}