import localStorage from '../localStorage'
import firebase from '../Firebase'
import moment from "moment-timezone"
const LetsDrive = (driverID, order) => {
    let db = firebase.database();
    db.ref(`drivers/readyToDrive/${driverID}`).once('value', snapshot => {

    })
        .then((result) => {
            let data = result.val();
            let status = {
                refrence: order.orderRef,
                canceled: false,
                assignedAt: order.assignedAt,
                timeZone: moment.tz.guess()
            }
            // we were adding the whole order
            //data.order = order
            data.status = status
            db.ref(`drivers/drivingNow/${driverID}`).set(data)
                .then(() => {
                    localStorage.storeData("@isDrivingNow", true);
                    result.ref.set(null);
                }).catch(err => console.log(err));
            console.log('driver is deleted from readyToDrive')
        })
        .catch(err => console.log(err));
}








export default LetsDrive