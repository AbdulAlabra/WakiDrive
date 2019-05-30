import firebase from "../Firebase"
import localStorage from "../localStorage"
import moment from 'moment-timezone';
import updateLocalStorage from './updateLocalStorage'
import updatePayment from '../payment/updatePayment'
const db = firebase.database();

const addCompletedOrder = (driverID, assignedAt, orderRefrence, orderID) => {
    let date = moment().tz('Asia/Riyadh').format('YYYY-MM-DD');
    let pcikedAt = moment(assignedAt);
    let deliveredAt = moment(moment().tz('Asia/Riyadh').format('YYYY-MM-DDTHH:mm:ss'));
    let duration = deliveredAt.diff(pcikedAt, 'minutes')
    console.log(duration)
    return db.ref(`drivers/registeredDrivers/${driverID}/driverHistory/completedOrders/orders/${date}`).push().set({
        duration,
        moneyMadeToday: 20,
        deliveredAt: moment().tz('Asia/Riyadh').format('YYYY-MM-DDTHH:mm:ss'),
        assignedAt: assignedAt,
        orderRefrence
    })
        .then(() => {
            console.log('driver history updated')
            return updateTotalMoeny(driverID)
                .then(isDone => {
                    if (isDone) {
                        return removeOrderLisner(driverID, orderID)
                            .then(() => {
                                return updatePayment()
                                    .then(paymentIsAdded => {
                                        if (paymentIsAdded) {
                                            return updateLocalStorage();
                                        }
                                        else {
                                            return false
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err)
                                        return false
                                    })
                            })
                    }
                    else {
                        return isDone
                    }
                })
                .catch(err => {
                    console.log(err)
                    return false
                })
        })
        .catch(err => {
            console.log(err)
            //something with the db
            return false
        })
}

const updateTotalMoeny = (driverID) => {
    return db.ref(`drivers/registeredDrivers/${driverID}/driverHistory/completedOrders`).once('value', function (snapshot) {
    })
        .then(data => {
            let result = data.val()
            let totalOrders = result.totalOrders
            let totalMoneyMade = result.totalMoneyMade
            return data.ref.update({
                totalMoneyMade: totalMoneyMade + 20,
                totalOrders: totalOrders + 1
            })
                .then(() => {
                    return true
                })
                .catch(err => {
                    console.log(err)
                    return false
                })
        })
        .catch(err => {
            console.log(err)
            return err
        })
}

const orderDetails = () => {
    return localStorage.retrieveData('@order')
        .then(order => {
            let orderRefrence = order.orderRef;
            let assignedAt = order.assignedAt;
            let orderID = order.orderID;

            return localStorage.retrieveData('@driverID')
                .then(driverID => {
                    return addCompletedOrder(driverID, assignedAt, orderRefrence, orderID)
                })
                .catch(err => {
                    console.log(err)
                    return false
                })
        })
        .catch(err => {
            console.log(err)
            return false
        })
}

const removeOrderLisner = (driverID, orderID) => {
    return db.ref(`orderListeners/${driverID}/${orderID}`).remove()
        .then(() => {
            console.log('order is removed from driver linsers');
            return true
        })
        .catch(err => {
            console.log(err)
            return false
        })
}

export default orderDetails