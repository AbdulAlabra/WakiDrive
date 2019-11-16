import firebase from "../Firebase"
import locaalStorage from '../localStorage'
import moment from "moment-timezone"

const db = firebase.database()

const query = () => {
    return locaalStorage.retrieveData("@driverID")
        .then(driverID => {
            return locaalStorage.retrieveData("@order")
                .then(order => {
                    if (order) {
                        let orderRefrence = order.orderRef
                        let paymentMethod = order.BuyerInfo.paymentMethod
                        let startingLocation = order.startingLocation
                        let cost = order.cost
                        if (paymentMethod === "visa") {
                            return paymentForDriver(driverID, orderRefrence, paymentMethod, startingLocation, cost);
                        }
                        else {
                            return saveNotPaid(driverID, orderRefrence, paymentMethod, startingLocation, cost);
                        }
                    }
                    else {
                        return false
                    }
                })

        })
        .catch(err => {
            console.log(err)
            return false
        })
}

// when order is paid by cash on delivery
const saveNotPaid = (driverID, orderRefrence, paymentMethod, startingLocation, costDetails) => {
    const { driverMoney, currency, commission, deliveryCost } = costDetails
    let timeZone = moment.tz.guess()
    let time = moment().tz(timeZone).format('LLLL');
    return db.ref(`drivers/registeredDrivers/${driverID}/driverHistory/payment/notPaid/current/payments`).push().set({
        time,
        timeZone,
        currency,
        driverMoney,
        commission,
        deliveryCost,
        paymentID: false,
        orderRefrence,
        paymentMethod,
        startingLocation
    })
        .then(() => {
            return true
        })
        .catch(err => {
            console.log(err)
            return false
        })
}

// when order is paid by visa
const paymentForDriver = (driverID, orderRefrence, paymentMethod, startingLocation, costDetails) => {
    const { driverMoney, currency, commission, deliveryCost } = costDetails
    let timeZone = moment.tz.guess()
    let time = moment().tz(timeZone).format('LLLL');
    return db.ref(`drivers/registeredDrivers/${driverID}/driverHistory/payment/paymentToDriver/current/payments`).push().set({
        time,
        timeZone,
        currency,
        driverMoney,
        commission,
        deliveryCost,
        paymentID: false,
        orderRefrence,
        paymentMethod,
        startingLocation
    })
        .then(() => {
            return true
        })
        .catch(err => {
            console.log(err)
            return false
        })
}





export default query
