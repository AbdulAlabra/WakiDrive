import localStorage from '../localStorage'
import Alert from '../Alert'
import arrivalValidation from './validateTime';
import orderDetails from './orderDetails';
import end from '../endJourney/end'
import orderPickedUp from './orderPickedUp'
import update from "../../request/delivery/updateOrderStatus"
import firebase from "../Firebase"
const pickNextStore = () => {
    return localStorage.retrieveData('@isDrivingNow')
        .then((isDrivingNow) => {

            if (isDrivingNow) {
                return getOverallOrder()
                // uncomment this when ready to publish
                //    return arrivalValidation().then(accepted => {
                //         if (accepted) {

                //             return getOverallOrder()

                //         }
                //         else {
                //             messege('Come on ... Be honest', 'We are smart enogh to know that you have not arrived yet');
                //             return false
                //         }       
                //     }).catch(err => {

                //         console.log(err);
                // return undefined
                //     })    
                // uncomment this when ready to publish

            }
            else {
                return false
            }
        })
        .catch(err => {
            console.log(err)
            return undefined
        })
}

const getOverallOrder = () => {
    return localStorage.retrieveData('@order')
        .then((order) => {

            let orders = order.sortedStoresKey;
            let pickedOrderKey = orders[0];

            orders.shift()
            let orderToPick = orders[0]
            let store = order.stores[orderToPick];

            if (orders.length === 0) {
                // get buyer location
                if (pickedOrderKey !== undefined) {
                    order.pickedOrders.push(pickedOrderKey);
                    let buyerLocation = order.buyerLocation;
                    let desteniation = order.stores[pickedOrderKey].location;
                    console.log("Time to go to buyer " + pickedOrderKey)
                    updateDeliveryStatus(order.orderRef, "picked-up", pickedOrderKey, desteniation)
                    updateDeliveryStatus(order.orderRef, "end-user", false, buyerLocation);
                    console.log('Time To Go TO THE BUYER')
                    return saveOrder(order, buyerLocation)
                }
                else {
                    return end().then(res => {
                        if (res) {
                            // messege('Thanks',  res.toString());
                            return 'delivered'
                        }
                        else {
                            messege('Something went wrong', res.toString());
                            return 'not delivered'
                        }
                    })
                        .catch(err => {
                            console.log(err)
                            return false
                        })
                }
            }
            else {
                //console.log("hiiii " + pickedOrderKey)
                let desteniation = store.location;
                updateDeliveryStatus(order.orderRef, "picked-up", pickedOrderKey, desteniation);
                updateDeliveryStatus(order.orderRef, "omw", orderToPick, desteniation);
                order.pickedOrders.push(pickedOrderKey);
                return saveOrder(order, store)
            }

        })
        .catch(err => {
            console.log(err)
            return undefined

        })
}

const saveOrder = (overallOrder, currentOrder) => {
    localStorage.storeData('@order', overallOrder)
        .then(res => {
            console.log('new overall order');
            console.log(res)
        })
        .catch(err => {
            console.log(err);
        })

    return localStorage.storeData('@currentOrder', currentOrder)
        .then((res) => {
            return orderDetails(res).then(details => {
                let title = details.name
                let body = details.orderDetails
                messege(title, body);
                return true


                //this is for updating database with the order status
                // return orderPickedUp("pickedUp")
                //     .then(res => {
                //         return res
                //     })
                //     .catch(err => {
                //         return false
                //     })
            }).catch(err => {
                console.log(err)
                return undefined
            });
        })
        .catch(err => {
            console.log(err)
        })
}

const messege = (title, body) => {
    Alert(title, body, () => console.log('ok'), () => console.log('cancel'));
}


const updateDeliveryStatus = (refrence, opreation, orderIndex, desteniationLocation) => {
    const driverID = firebase.auth().currentUser.uid
    return navigator.geolocation.getCurrentPosition(position => {
        let location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        }
        let origin = `${location.latitude},${location.longitude}`
        let desteniation =  `${desteniationLocation.latitude},${desteniationLocation.longitude}`

        return update(refrence, driverID, opreation, origin, orderIndex, desteniation)
            .then(result => {
                console.log(result)
                return result
            })
            .catch(err => {
                console.log(err)
                return false
            })
    }, err => console.log(err), { maximumAge: 0, enableHighAccuracy: true })

}


export default pickNextStore