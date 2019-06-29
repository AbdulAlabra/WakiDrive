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
import LetsDrive from '../orders/LetsDrive'
import currentDestination from '../orders/currentDestination'
import moment from "moment-timezone"
import readyToDrive from "../isReadyToDrive"
import updateOrderStatus from "../orders/updateUnfulfilledOrders"
import removeLocalOrder from "../endJourney/updateLocalStorage"

import cancelOrder from '../../request/delivery/cancelOrder'
import updateDeliveryStatus from "../../request/delivery/updateOrderStatus"
import assignNewOrder from "../../request/delivery/newOrder"


export default class Notification extends Component {

    state = {
        pressCanceled: 0,
        deletedOrders: 0,
        totalOrders: 0,
        storeName: "",
        region: null,
        isAlertOpen: false,
        coordinates: [],
        steps: [],
        routeIsAdded: false,

        isLoggedIn: undefined,
        driverID: undefined,
        driverToken: undefined,
    }


    authantication() {
        const auth = firebase.auth()
        auth.onAuthStateChanged(user => {
            if (user) {
                console.log("-----LOGIN------")
                const driverID = user.uid
                user.getIdToken()
                    .then(driverToken => {
                        this.setState({ isLoggedIn: true, driverToken, driverID });
                        this.isDrivingNow()
                    })
                    .catch(err => {
                        console.log(err)
                    })
                console.log(user)
            }
            else {
                this.setState({ isLoggedIn: false, driverToken: false, driverID: false });
                console.log("---LOG OUT OR NOT A USER----")
            }

        }, err => {
            console.log(err)
        })
    }

    componentWillMount() {
        this.authantication();
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
        if (this.props.readyToDrive === true) {
            console.log("Get order !!!!!")
            this.test()
        }
    }

    watchCanceledOrders() {
        const { driverID } = this.state
        firebase.database().ref(`drivers/drivingNow/${driverID}/status/canceled`).on("value", (snap) => {
            let status = snap.val()
            //if (key === "")
            //let message = status
            if (status === true) {
                this.showAlert("order", "canceled", false)
                //console.log(status)
                //console.log(key)
                snap.ref.parent.parent.set(null);
                removeLocalOrder()
                    .then(res => {
                        readyToDrive(true)
                        this.delivered("We are very sorry")
                    })
                    .catch(err => {
                        console.log(err)

                    })
            }

        })
    }

    isDrivingNow() {
        localStorage.retrieveData('@isDrivingNow')
            .then(res => {
                if (res) {
                    this.watchCanceledOrders()
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
                                //this.showAlert("Do not miss any order", "turn on the button", false);
                            }
                        })
                }
            }).catch(err => console.log(err));
    }

    updateDeliver(refrence, opreation, orderIndexToUpdate) {
        const { driverID } = this.state

        navigator.geolocation.getCurrentPosition(position => {
            let location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            }
            let latlang = `${location.latitude},${location.longitude}`
            return updateDeliveryStatus(refrence, driverID, opreation, latlang, orderIndexToUpdate)
        }, err => console.log(err), { maximumAge: 0, enableHighAccuracy: true })
    }

    cancelWhileDriving() {
        localStorage.retrieveData("@order")
            .then(order => {
                if (order) {
                    const { orderRef, orderID } = order
                    this.onPressCancel(orderID, orderRef);
                }
            })
            .catch(err => {
                console.log(err)
                return false
            })
    }
    
    assign(refrence) {
        const { driverID } = this.state
        navigator.geolocation.getCurrentPosition(position => {
            let location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            }
            let latlang = `${location.latitude},${location.longitude}`
            return assignNewOrder(refrence, driverID, latlang)
        }, err => console.log(err), { maximumAge: 0, enableHighAccuracy: true })

    }

    checkOrders() {
        const { driverID } = this.state

        firebase.database().ref(`orderListeners/${driverID}`).once('value', snapshot => {
            let numOrder = snapshot.numChildren();
            this.setState({ totalOrders: numOrder })
            if (numOrder === 0) {
                // this.showAlert('You do not have any orders now', "Stay close to your phone we will give an order soon", false)
            }
            this.props.checkOrder(false);
            return this.ListenToComingOrders();
        })
    }

    nextTrip(status) {
        currentDestination().then(destination => {
            if (status === 'delivered') {
                this.delivered()
            }
            else if (status === 'canceled') {
                this.setState({ pressCanceled: 1 })
                this.cancelWhileDriving();
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
        const { driverID } = this.state
        let x = 0

        firebase.database().ref(`orderListeners/${driverID}`).on('child_added', (snapshot) => {
            console.log("HIIIII");
            let orderID = snapshot.key;
            console.log('orderID ' + orderID)
            this.isOrderFulfilled(orderID).then(status => {
                x++
                if (status) {
                    let deletedOrder = this.state.deletedOrders + 1;
                    this.setState({ deletedOrders: deletedOrder });
                    snapshot.ref.remove()
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
            this.showAlert('Order Canceled', "You may not be able to drive for some period of time.", false);
            const uid = firebase.auth().currentUser.uid
            const timeZone = moment.tz.guess();
            navigator.geolocation.getCurrentPosition(position => {
                let location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }
                let latlang = `${location.latitude},${location.longitude}`
                cancelOrder(orderRefrence, uid, "driver", timeZone, latlang)
            }, err => console.log(err), { maximumAge: 0, enableHighAccuracy: true })

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
        const { driverID } = this.state
        let timeZone = moment.tz.guess()
        let assignedAt = moment().tz(timeZone).format('YYYY-MM-DDTHH:mm:ss')

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
                                this.assign(order.orderRef);
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
    test() {
        console.log("Yooooooooooooo")
        this.props.checkOrder(false);
    }
    // order Checking proccess
    delivered(messge) {
        this.setState({ coordinates: [], steps: [] });
        Alert(messge || 'You Did it! Thanks..', 'You like to keep driving ?',
            () => {
                this.checkOrders()
            }, () => {
                readyToDrive(false)
                this.props.delivered("red");
                this.setState({
                    steps: [],
                    cords: [],
                })
            },
            "Yes", "No")
    }

    render() {
        const { isLoggedIn } = this.state
        const { readyToDrive, nextTripAccepted } = this.props

        return (
            <Container
                nextTripAccepted={nextTripAccepted}
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


