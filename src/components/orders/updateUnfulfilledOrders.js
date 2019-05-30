import firebase from '../Firebase'
import localStorage from '../localStorage'
import moment from "moment-timezone"


const updateOrderStatus = (status) => {
    let time = moment().tz('Asia/Riyadh').format('YYYY-MM-DDTHH:mm:ss');
    return localStorage.retrieveData('@driverID')
        .then(driverID => {

            return localStorage.retrieveData('@order')
                .then(order => {
                    let orderID = order.orderID
                    let orderRefrence = order.orderRef

                    return localStorage.retrieveData('@currentOrder')
                        .then(destaination => {
                            destaination.orderID = orderID
                            destaination.orderRefrence = orderRefrence
                            return firebase.database().ref(`unfulfilled/${orderID}/orderStatus/`).push().set({
                                status: [{ status, time }],
                                driverID,
                                destaination,
                            }).then(() => {
                                return true
                            })
                                .catch(err => {
                                    console.log(err)
                                    return false
                                })
                        })
                        .catch(err => {
                            console.log(err)
                            return false
                        });
                })
                .catch(err => {
                    console.log(err)
                    return false
                })
        })
        .catch(err => {
            console.log(err)
            return false

        });
}

export default updateOrderStatus