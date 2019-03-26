import localStorage from '../localStorage'
import Alert from '../Alert'
import arrivalValidation from './validateTime';
import orderDetails from './orderDetails';
import end from '../endJourney/end'



const pickNextStore = () => {
    return localStorage.retrieveData('@isDrivingNow')
        .then((isDrivingNow) => {
            console.log(isDrivingNow);
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
                        console.log('Time To Go TO THE BUYER')
                        return saveOrder(order, buyerLocation)
                    }
                    else {
                        return end().then(res => {
                            if (res) {
                                // messege('Thanks', 'Wait for new order ');
                                return 'delivered'
                            }
                            else {
                                messege('Something went wrong', 'please wait ');
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
const finalCheck = () => {
    Alert('ARE YOU SURE ?', "Did the custome get the item ? \n if YES, then click OK, if NOT, then hit no", () => {
        end().then(res => {
            if (res) {
                messege('Thanks', 'Wait for new order ');
                return 'delivered'
            }
            else {
                messege('Something went wrong', 'please wait ');
                return 'not delivered'
            }
        })
            .catch(err => {
                console.log(err)
                return false
            })
    },
        () => {
            return 'not delivered'
        },
        'Yes', 'NO'
    )
}
export default pickNextStore