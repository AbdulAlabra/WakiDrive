
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
import polylineChecker from "../RedirectUserLocation"

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
        stepStatus: undefined,
        journeyDetails: false,
        currentStep: 0,
        newLocation: false,
        title: "Heeeeeeeelllloooooooo"
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
                console.log('res ' + res)
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
                    this.setState({ coordinates: steps.cords, steps: steps.steps, journeyDetails: steps.details, currentStep: 0, newLocation: true });
                    this.setState({ newLocation: false })
                }).catch(err => console.log(err));
            });

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
                    let driverID = firebase.auth().currentUser.uid;
                    LetsDrive(driverID)
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
                            this.saveOrderLocally(stores, buyerLocation, orderRef, sortedKeys, orderID);
                        }

                    })
                    .catch(err => console.log(err));
            }, err => console.log(err));

        }).catch(err => {
            console.log(err);
        })
    }
    // #6
    saveOrderLocally(stores, buyerLocation, orderRef, sortedStoresKey, orderID) {
        let assignedAt = moment().tz('Asia/Riyadh').format('YYYY-MM-DDTHH:mm:ss')
        let order = {
            pickedOrders: [],
            stores,
            buyerLocation,
            orderRef,
            orderID,
            sortedStoresKey,
            assignedAt
        }
        //save overall order
        localStorage.storeData("@order", order)
            .then(response => {
                let closestStoreKey = response.sortedStoresKey[0];
                let store = response.stores[closestStoreKey];
                console.log(response);
                //save current destination/store
                localStorage.storeData('@currentOrder', store)
                    .then(chosenStore => {
                        this.route()
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
                this.setState({ driverStatus: undefined })
            },
            "Yes", "No")
    }
    watchUserLocation() {
        navigator.geolocation.watchPosition(position => {
            // if (this.state.steps.length > 0) {
            //     let driverLocation = {
            //         latitude: position.coords.latitude,
            //         longitude: position.coords.longitude,
            //     }
            //     this.stepChecker(driverLocation)
            // }

        }, err => console.log(err));
    }
    stepChecker(driverLocation) {
        const { steps, currentStep } = this.state
        let step = steps[currentStep]
        polylineChecker(step, driverLocation)
            .then(res => {
                console.log(res);
                // if (res === "step completed") {
                //     if (steps[currentStep + 1] === undefined) {
                //         this.setState({ stepStatus: "completed", steps: [] })
                //     }
                //     else {
                //         this.setState({ currentStep: currentStep + 1 });
                //     }
                // }
                // else if (res === "redirect") {
                //     this.route();
                //     this.setState({ stepStatus: res })
                // }
            })
            .catch(err => {
                this.setState({ stepStatus: undefined })
                console.log(err)
            })
    }
    journeyFunction() {
        console.log(this.state.journeyDetails);
        if (this.state.journeyDetails === false) {
            return;
        } else {
            this.props.journey(this.state.journeyDetails)
        }
        // this.setState({ title: false })
        // return journy
    }
    render() {
        const { readyToDrive, nextTripAccepted, testFun } = this.props
        return (
            <Container
                readyToDrive={(readyToDrive === true) ? this.checkOrders() : null}
                nextTripAccepted={nextTripAccepted}
                testFun={testFun(this.state.driverStatus)}
            // journey={(this.state.journeyDetails === false) ? null : journey(this.journeyFunction())}
            // journey={this.journeyFunction()}

            >
                <Map
                    cords={this.state.coordinates}
                    step={this.state.steps}
                />

                {this.watchUserLocation()}
            </Container>
        )
    }
}
