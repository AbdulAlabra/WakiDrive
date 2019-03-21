// Optional: Flow type
import React, { Component } from 'react';
import RNFirebase from 'react-native-firebase';
import { View } from 'native-base';
import Alert from '../Alert'
import firebase from '../Firebase';
import localStorage from '../localStorage';
import sortStores from "../sortStores";
import bestOrder from "./helpers/critiria";
import MapView, { Marker, Polyline } from 'react-native-maps';
import { directions } from '../Directions';
import Map from '../map'

export default class Notification extends Component {
    state = {
        name: "",
        region: null,
        totalOrders: 0,
        orders: [],
        deletedOrders: 0,
        isNotificationOpened: false,
        coordinates: [],
        driverLocation: ''
    }
    componentWillMount() {
        this.createNotificationListeners();
        this.numberOfOrders();

    }
    componentWillUnmount() {
        this.notificationListener();
        this.notificationOpenedListener();
    }
    componentDidMount() {
    }
    numberOfOrders() {
        localStorage.retrieveData('@fcmToken')
            .then(token => {
                if (token) {
                    firebase.database().ref(`orderListeners/${token}`).on('value', snapshot => {
                        let result = snapshot.val()
                        // console.log(result);
                        let numOrder = snapshot.numChildren().toString();
                        this.setState({ totalOrders: numOrder })
                        return this.ListenToComingOrders();
                    })
                }
                else {
                    //no TOKEN 
                    console.log('No token');
                    return
                }
            })
            .catch(err => {
                console.log(err);
            })

    }
    async createNotificationListeners() {
        //background
        this.notificationOpenedListener = RNFirebase.notifications().onNotificationOpened((notificationOpen) => {
            this.setState({ isNotificationOpened: true });
            const { title, body } = notificationOpen.notification;
            const { orderID, dbRef } = notificationOpen.notification.data;

            // this.showAlert(orderID, 'background', false);
        });

        const notificationOpen = await RNFirebase.notifications().getInitialNotification();
        if (notificationOpen) {
            this.setState({ isNotificationOpened: true });
            const { title, body } = notificationOpen.notification;
            const { orderID, dbRef } = notificationOpen.notification.data;

            // this.showAlert(orderID, 'getInitialNotification', false);
        }
    }

    // order Checking proccess
    // #1
    ListenToComingOrders() {
        let x = 0
        localStorage.retrieveData('@fcmToken').then(token => {
            firebase.database().ref(`orderListeners/${token}`).on('child_added', (snapshot) => {
                let orderID = snapshot.key;
                this.isOrderFulfilled(orderID).then(status => {
                    x++
                    console.log(status);
                    if (status) {
                        let deletedOrder = this.state.deletedOrders + 1;
                        this.setState({ deletedOrders: deletedOrder });
                        snapshot.ref.remove()
                            .then(() => this.showAlert('Firebase', "Delete ", false))
                            .catch(err => this.showAlert('Firebase', "Delete WRONG", false));
                    }

                    if (x === Number(this.state.totalOrders)) {
                        console.log('---------DONE----------')
                        bestOrder().then(order => {
                            let orderRefrence = order.orderRefrence
                            let orderID = order.orderID
                            console.log(orderRefrence);

                            this.showAlert("You Have One Order", "Lets drive now ", orderID, orderRefrence);
                        }).catch(err => console.log(err));
                    }
                }).catch(err => {
                    console.log(err);
                });

            })
        }).catch(err => console.log(err));
    }
    // #2
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

    // #3
    showAlert(title, body, orderID, orderRefrence) {
        if (orderID === false) {
            Alert(title, body, () => this.setState({ isNotificationOpened: false }), () => this.setState({ isNotificationOpened: false }));
            return;
        }
        else {
            Alert(title, body, () => this.onPressOk(orderID, orderRefrence), () => this.onPressCancel(orderID, orderRefrence))
            return;
        }
    }
    // # 4
    onPressOk(orderID, orderRefrence) {
        this.isOrderFulfilled(orderID)
            .then(res => {
                if (res) {
                    this.showAlert('Sorry You Missed it', 'Do not worry we have punch of orders', false);
                }
                else {
                    this.getOrderDetails(orderRefrence);
                    this.showAlert("Let's drive !", "Be Save & Enjoy ", false);
                }
            })
            .catch(err => console.log(err));
    }
    // #4
    onPressCancel(orderID, orderRefrence) {
        this.showAlert('THIS IS VERY SERIUOS', "DO not cancel chosen picked up for you ", orderID, orderRefrence);
    }
    // #5
    getOrderDetails(dbRef) {
        let orderRef = dbRef.replace('/stores', "");
        firebase.database().ref(orderRef).once('value', snapshot => {
        }).then(res => {
            //order from db ref
            let order = res.val();
            let stores = order.stores
            let buyerLocation = order.BuyerLocation
            navigator.geolocation.getCurrentPosition(location => {
                let lat = location.coords.latitude;
                let lang = location.coords.longitude;
                let driver = `${lat},${lang}`
                let driverLocation = {
                    latitude: lat,
                    longitude: lang
                }
                this.setState({ driverLocation })
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
    // #6
    saveOrderLocally(stores, buyerLocation, orderRef, sortedStoresKey) {
        let order = {
            stores,
            buyerLocation,
            orderRef,
            sortedStoresKey
        }
        localStorage.storeData("@order", order)
            .then(response => {
                console.log('----------------------ORDER Saved locally--------------------')
                this.drawLines()
                localStorage.storeData("@isDrivingNow", true);
                console.log('----------------------ORDER Saved locally--------------------')
                // console.log(response);

            })
            .catch(err => console.log(err))
    }
    // order Checking proccess

    //directions 

    drawLines() {
        localStorage.retrieveData("@order")
            .then(order => {
                let storeKey = order.sortedStoresKey[0];
                let store = order.stores[storeKey];
                let origin = this.state.driverLocation;
                let destination = store.storeLocation;
                console.log(order);
                console.log('------------Choosen Store--------')
                console.log(store);
                directions(origin, destination).then(cords => {
                    this.setState({ coordinates: cords });
                }).catch(err => console.log(err));
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {
        return (
            <Map region={this.state.region}
                cords={this.state.coordinates}
            />
        )
    }
}