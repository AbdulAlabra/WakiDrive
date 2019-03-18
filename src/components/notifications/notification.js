// Optional: Flow type
import React, { Component } from 'react';
import RNFirebase from 'react-native-firebase';
import { View } from 'native-base';
import Alert from '../Alert'
import firebase from '../Firebase';
import localStorage from '../localStorage';
import sortStores from "../sortStores";

export default class Notification extends Component {
    state = {
        name: "",
        totalOrders: 0,
        isNotificationOpened: false,
    }
    componentWillMount() {
        this.createNotificationListeners();
        this.ListenToComingOrders();
    }
    //Remove listeners allocated in createNotificationListeners()
    componentWillUnmount() {
        this.notificationListener();
        this.notificationOpenedListener();
    }

    async createNotificationListeners() {
        //background
        this.notificationOpenedListener = RNFirebase.notifications().onNotificationOpened((notificationOpen) => {
            this.setState({ isNotificationOpened: true });
            const { title, body } = notificationOpen.notification;
            const { orderID, dbRef } = notificationOpen.notification.data;

            this.showAlert(orderID, 'background', false);
        });

        const notificationOpen = await RNFirebase.notifications().getInitialNotification();
        if (notificationOpen) {
            this.setState({ isNotificationOpened: true });
            const { title, body } = notificationOpen.notification;
            const { orderID, dbRef } = notificationOpen.notification.data;

            this.showAlert(orderID, 'getInitialNotification', false);
        }
    }

    async isOrderFulfilled(orderID) {
        return firebase.database().ref(`unfulfilled/${orderID}`).once('value')
            .then(result => {
                let order = result.val();
                let orderStatus = order.orderStatus;
                if (orderStatus === "new" || orderStatus === "unfulfilled") {
                    return false;
                }
                else {
                    //if it's true, it means that some one already took it.
                    return true;
                }

            })
            .catch(err => console.log(err));
    }

    ListenToComingOrders() {
        localStorage.retrieveData('fcmToken')
            .then(token => {
                firebase.database().ref(`orderListeners/${token}`).on('child_added', (snapshot) => {
                    let orderID = snapshot.key;
                    let dbRef = snapshot.val();
                    let prevNumber = this.state.totalOrders;
                    this.setState({ totalOrders: prevNumber + 1 });
                    this.isOrderFulfilled(orderID)
                        .then(status => {
                            if (status) {
                                //delete any order that is fulfilled
                                snapshot.ref.remove()
                                    .then(() => this.showAlert('Firebase', "Delete " + orderID, false))
                                    .catch(err => this.showAlert('Firebase', "Delete WRONG", false));

                            } else {
                                if (!this.state.isNotificationOpened) {
                                    this.showAlert('Firebase', "New Order", false);
                                    this.getOrderDetails(dbRef)
                                }

                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })

                })
            })
            .catch(err => console.log(err));
    }

    onPressOk(orderID) {
        this.isOrderFulfilled(orderID)
            .then(res => {
                if (res) {
                    this.showAlert('Sorry You Missed it', 'Do not worry we have punch of orders', false);
                }
                else {
                    this.showAlert("Let's drive !", "Be Save & Enjoy ", false);
                }
            })
            .catch(err => console.log(err));
    }

    showAlert(title, body, orderID) {
        if (orderID === false) {
            Alert(title, body, () => this.setState({ isNotificationOpened: false }), () => this.setState({ isNotificationOpened: false }));
            return;
        }
        else {
            Alert(title, body, () => this.onPressOk(orderID), () => console.log('cancel'))
            return;
        }
    }

    getOrderDetails(dbRef) {
        let orderRef = dbRef.replace('/stores', "");
        firebase.database().ref(orderRef).once('value', snapshot => {
        }).then(res => {
            let order = res.val();
            let stores = order.stores

            let buyerLocation = order.BuyerLocation
            navigator.geolocation.getCurrentPosition(location => {
                let lat = location.coords.latitude;
                let lang = location.coords.longitude;
                let driver = `${lat},${lang}`
                sortStores(driver, stores)
                    .then(sortedKeys => {
                        if (sortedKeys) {
                            console.log(sortedKeys);
                            this.saveOrderLocally(stores, buyerLocation, orderRef, sortedKeys);
                        }

                    })
                    .catch(err => console.log(err));
            }, err => console.log(err));


        }).catch(err => {
            console.log(err);
        })
    }

    saveOrderLocally(stores, buyerLocation, orderRef, sortedStoresKey) {
        let order = {
            stores,
            buyerLocation,
            orderRef,
            sortedStoresKey
        }
        localStorage.storeData("order", order)
            .then(response => {
                console.log('----------------------ORDER Saved--------------------')
                console.log(response);
                console.log('----------------------ORDER Saved--------------------')
                // console.log(response);

            })
            .catch(err => console.log(err))
    }



    render() {
        return (

            <View>

            </View>
        )
    }
}