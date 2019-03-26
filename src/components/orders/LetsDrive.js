import localStorage from '../localStorage'
import firebase from '../Firebase'

const LetsDrive = (driverID) => {
    let db = firebase.database();
    db.ref(`drivers/readyToDrive/${driverID}`).once('value', snapshot => {

    })
        .then((result) => {
            const data = result.val();
            db.ref(`drivers/drivingNow/${driverID}`).set(data)
                .then(() => {
                    localStorage.storeData("@isDrivingNow", true);
                    result.ref.set(null);
                }).catch(err => console.log(err));
            console.log('driver is deleted from readyToDrive')
        })
        .catch(err => console.log(err));
}
const updateCurrentDelivery = () => {

    // localStorage.storeData("@currentOrder", true);

}






export default LetsDrive