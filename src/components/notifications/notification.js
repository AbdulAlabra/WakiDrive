import React, { Component } from 'react';
import { Container } from 'native-base';
import RNFirebase from 'react-native-firebase';
import Alert from '../Alert'
import firebase from '../Firebase';
import localStorage from '../localStorage';
import sortStores from "../sortStores";
import bestOrder from "./helpers/critiria";
import { directions } from '../Directions';
import Map from '../map'
import cancelOrder from '../orders/canceledOrders'
import LetsDrive from '../orders/LetsDrive'
import currentDestination from '../orders/currentDestination'
import moment from "moment-timezone"
import readyToDrive from "../isReadyToDrive"
import updateOrderStatus from "../orders/updateUnfulfilledOrders"
import updateDeliveryStatus from "../../request/delivery/updateOrderStatus"


export default class Notification extends Component {

    state = {
        pressCanceled: 0,
        deletedOrders: 0,
        totalOrders: 0,
        storeName: "",
        region: null,
        isAlertOpen: false,
        driverStatus: undefined,
        coordinates: [],
        steps: [],
        routeIsAdded: false,

    }

    componentWillMount() {
        this.isDrivingNow()
    }
    componentDidMount() {
        //for fresh token
        // this.onTokenRefreshListener = RNFirebase.messaging().onTokenRefresh(fcmToken => {
        //     // Process your token as required
        //     Alert('New FCM ', fcmToken, () => console.log('ok'), () => console.log('cancel'));
        // });
        this.createNotificationListeners();
    }
    componentWillUnmount() {
        this.notificationListener();
        this.notificationOpenedListener();
        //for fresh token 
        // this.onTokenRefreshListener();
    }
    componentDidUpdate() {
        if (this.props.nextTripAccepted) {
            this.nextTrip(this.props.nextTripAccepted)
        }
    }
    isDrivingNow() {
        localStorage.retrieveData('@isDrivingNow')
            .then(res => {
                if (res) {
                    this.route()
                }
                else {
                    localStorage.retrieveData('@isReadyToDrive')
                        .then(res => {
                            if (res) {
                                this.checkOrders();
                            }
                            else {
                                // you may want to uncomment this to let the user know when they are not ready to drive
                                this.showAlert("Do not miss any order", "turn on the button", false);
                            }
                        })
                }
            }).catch(err => console.log(err));
    }
    updateDeliver(refrence, opreation, orderIndexToUpdate) {
        return localStorage.retrieveData('@driverID')
            .then(driverID => {
                if (driverID) {

                    navigator.geolocation.getCurrentPosition(position => {
                        let location = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        }
                        let latlang = `${location.latitude},${location.longitude}`
                        return updateDeliveryStatus(refrence, driverID, opreation, latlang, orderIndexToUpdate)
                    }, err => console.log(err), { maximumAge: 0, enableHighAccuracy: true })
                }
                else {
                    return false
                }
            })
            .catch(err => {
                console.log(err)
                return false
            })
    }

    checkOrders() {
        localStorage.retrieveData('@driverID')
            .then(driverID => {
                if (driverID) {
                    firebase.database().ref(`orderListeners/${driverID}`).once('value', snapshot => {
                        let numOrder = snapshot.numChildren();
                        this.setState({ totalOrders: numOrder })
                        if (numOrder === 0) {
                            // this.showAlert('You do not have any orders now', "Stay close to your phone we will give an order soon", false)
                        }
                        return this.ListenToComingOrders();
                    })
                }
                else {
                    //no TOKEN 
                    console.log('No driverID');
                    return
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
    nextTrip(status) {
        currentDestination().then(destination => {
            if (status === 'delivered') {
                this.delivered()
            }
            else {
                //repetitive
                this.route()
            }
        }).catch(err => console.log(err));
    }
    route() {
        currentDestination().then(destination => {
            navigator.geolocation.getCurrentPosition(location => {
                let lat = location.coords.latitude.toString()
                let long = location.coords.longitude.toString()
                let origin = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                }

                directions(origin, destination).then(steps => {
                    if (steps !== "ZERO_RESULTS") {
                        this.setState({ coordinates: steps.cords, steps: steps.steps, routeIsAdded: true });
                    }
                    else {
                        console.log("Location not found")
                        this.delivered()
                    }

                }).catch(err => console.log(err));
            }, err => console.log(err), { maximumAge: 0, enableHighAccuracy: true });

        }).catch(err => console.log(err));
    }

    async createNotificationListeners() {
        //background
        this.notificationOpenedListener = RNFirebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body } = notificationOpen.notification;
            const { orderID, dbRef } = notificationOpen.notification.data;

            // this.showAlert(orderID, 'background', false);
        });

        const notificationOpen = await RNFirebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const { title, body } = notificationOpen.notification;
            const { orderID, dbRef } = notificationOpen.notification.data;

            // this.showAlert(orderID, 'getInitialNotification', false);
        }
    }
    // order Checking proccess
    // #1
    ListenToComingOrders() {
        let x = 0
        localStorage.retrieveData('@driverID').then(driverID => {
            firebase.database().ref(`orderListeners/${driverID}`).on('child_added', (snapshot) => {
                let orderID = snapshot.key;
                console.log('orderID ' + orderID)
                this.isOrderFulfilled(orderID).then(status => {
                    x++
                    if (status) {
                        let deletedOrder = this.state.deletedOrders + 1;
                        this.setState({ deletedOrders: deletedOrder });
                        snapshot.ref.remove()
                            .then(() => this.showAlert('Firebase', "Delete ", false))
                            .catch(err => this.showAlert('Firebase', "Delete WRONG", false));
                    }

                    else if (x >= Number(this.state.totalOrders)) {
                        let updatedTotalOrders = this.state.totalOrders - this.state.deletedOrders;
                        this.setState({ totalOrders: updatedTotalOrders })
                        bestOrder().then(order => {
                            console.log('---------New Order----------')
                            let orderRefrence = order.orderRefrence
                            let orderID = order.orderID
                            console.log(orderID);
                            console.log('---------New Order----------')
                            if (this.state.isAlertOpen === false) {
                                this.showAlert("You Have One Order", "Lets drive now ", orderID, orderRefrence);
                                this.setState({ isAlertOpen: true })
                            }
                        }).catch(err => console.log(err));
                    }

                }).catch(err => {
                    console.log(err);
                });
            })
        }).catch(err => console.log(err));
    }
    // #2
    isOrderFulfilled(orderID) {
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
            Alert(title, body, () => console.log('ok'), () => console.log('cancel'));
            return;
        }
        else {
            Alert(title, body, () => this.onPressOk(orderID, orderRefrence), () => this.onPressCancel(orderID, orderRefrence))
            return;
        }
    }
    // # 4
    onPressOk(orderID, orderRefrence) {
        this.setState({ isAlertOpen: false })
        this.isOrderFulfilled(orderID)
            .then(res => {
                if (res) {
                    this.showAlert('Sorry You Missed it', 'Do not worry we have punch of orders', false);
                }
                else {
                    this.getOrderDetails(orderRefrence, orderID);

                    this.showAlert("Let's drive !", "Be Save & Enjoy ", false);
                }
            })
            .catch(err => console.log(err));
    }

    // #4
    onPressCancel(orderID, orderRefrence) {
        this.setState({ isAlertOpen: false })
        if (this.state.pressCanceled === 1) {
            this.showAlert('Order Canceled', "You Will band you for sometime", false);
            cancelOrder(orderRefrence, orderID)
        }
        else {
            this.setState({ pressCanceled: 1 })
            this.showAlert('THIS IS VERY SERIUOS', "DO not cancel chosen picked up for you ", orderID, orderRefrence);
        }

    }
    // #5
    getOrderDetails(dbRef, orderID) {
        let orderRef = dbRef.replace('/stores', "");
        firebase.database().ref(orderRef).once('value', snapshot => {
        }).then(res => {
            //order from db ref
            let order = res.val();
            let stores = order.destinations
            let buyerLocation = order.BuyerLocation
            let BuyerInfo = order.BuyerInfo
            let cost = order.cost
            navigator.geolocation.getCurrentPosition(location => {

                let startingLocation = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                }
                let driver = `${startingLocation.latitude},${startingLocation.longitude}`

                sortStores(driver, stores)
                    .then(sortedKeys => {
                        if (sortedKeys) {
                            this.saveOrderLocally(stores, buyerLocation, BuyerInfo, orderRef, startingLocation, sortedKeys, orderID, cost);
                        }

                    })
                    .catch(err => console.log(err));
            }, err => console.log(err), { maximumAge: 0, enableHighAccuracy: true });

        }).catch(err => {
            console.log(err);
        })
    }

    // #6
    saveOrderLocally(stores, buyerLocation, BuyerInfo, orderRef, startingLocation, sortedStoresKey, orderID, cost) {
        let assignedAt = moment().tz('Asia/Riyadh').format('YYYY-MM-DDTHH:mm:ss')
        let order = {
            pickedOrders: [],
            stores,
            buyerLocation,
            orderRef,
            orderID,
            sortedStoresKey,
            assignedAt,
            BuyerInfo,
            startingLocation,
            cost
        }
        //save overall order
        localStorage.storeData("@order", order)
            .then(response => {
                let closestStoreKey = response.sortedStoresKey[0];
                this.updateDeliver(order.orderRef, "omw", closestStoreKey)
                let store = response.stores[closestStoreKey];

                console.log(response);
                //save current destination/store
                localStorage.storeData('@currentOrder', store)
                    .then(chosenStore => {

                        this.route()
                        updateOrderStatus("order accepted")
                            .then(res => {
                                let driverID = firebase.auth().currentUser.uid;
                                LetsDrive(driverID, order)
                                console.log("resssssss: " + res)
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    })
                    .catch(err => {
                        console.log(err);
                    })

            }).catch(err => console.log(err))
    }
    // order Checking proccess
    delivered() {
        this.setState({ coordinates: [], steps: [] });
        Alert('You Did it! Thanks..', 'You like to keep driving ?',
            () => {
                this.checkOrders()
            }, () => {
                console.log('cancel');
                readyToDrive(false)
                this.setState({ driverStatus: "red" })
                this.setState({
                    driverStatus: undefined,
                    steps: [],
                    cords: [],
                })
            },
            "Yes", "No")
    }

    render() {
        const { readyToDrive, nextTripAccepted, testFun } = this.props
        return (
            <Container
                readyToDrive={(readyToDrive === true) ? this.checkOrders() : null}
                nextTripAccepted={nextTripAccepted}
                testFun={testFun(this.state.driverStatus)}


            >
                <Map
                    cords={this.state.coordinates}
                    step={this.state.steps}

                    Reroute={() => this.route()}
                    newRoute={this.state.routeIsAdded}
                    routeIsAdded={() => this.setState({ routeIsAdded: false })}
                />

            </Container>
        )
    }

}
