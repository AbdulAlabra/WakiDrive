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
                        if (paymentMethod === "visa") {
                            return paymentForDriver(driverID, orderRefrence, paymentMethod, startingLocation)
                        }
                        else {
                            return saveNotPaid(driverID, orderRefrence, paymentMethod, startingLocation)
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
const saveNotPaid = (driverID, orderRefrence, paymentMethod, startingLocation) => {
    let time = moment().tz('Asia/Riyadh').format('YYYY-MM-DDTHH:mm:ss');
    return db.ref(`drivers/registeredDrivers/${driverID}/driverHistory/payment/notPaid/current/payments`).push().set({
        time,
        driverMoney: false,
        paymentID: false,
        commission: false,
        deliveryCost: false,
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
const paymentForDriver = (driverID, orderRefrence, paymentMethod, startingLocation) => {
    let time = moment().tz('Asia/Riyadh').format('YYYY-MM-DDTHH:mm:ss');
    return db.ref(`drivers/registeredDrivers/${driverID}/driverHistory/payment/paymentToDriver/current/payments`).push().set({
        time,
        paymentID: false,
        driverMoney: false,
        commission: false,
        deliveryCost: false,
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
