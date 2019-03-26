import firebase from '../Firebase'
import moment from "moment-timezone";

const canceledOrder = (driverID, orderRefrence, orderID) => {

    let canceledTime = moment().tz('Asia/Riyadh').format('YYYY-MM-DDTHH:mm:ss');
    let date = moment().tz('Asia/Riyadh').format('YYYY-MM-DD')
    firebase.database().ref(`drivers/registeredDrivers/${driverID}/driverHistory/canceledOrders/${date}/${orderID}`).update({
        canceledTime,
        orderRefrence: orderRefrence,
    })
        .then(() => {
            firebase.database().ref(`drivers/registeredDrivers/${driverID}/driverHistory/canceledOrders/totalOrders`).once('value', snapshot => {
                let prev = snapshot.val()
                snapshot.ref.set( prev + 1);
            })
                .then(() => {
                    console.log('total is updated');
                })
                .catch(err => console.log('err'))
        })
        .catch(err => {
            console.log(err);
        })
}


export default canceledOrder