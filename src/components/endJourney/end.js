import firebase from '../Firebase'
import localStorage from '../localStorage'
import delivered from './completedOrder'


const updateDriverStatus = () => {

    return localStorage.retrieveData('@driverID')
        .then(driverID => {
            return firebase.database().ref(`drivers/drivingNow/${driverID}`).once('value', snapshot => { })
                .then(res => {
                    let driver = res.val();
                    return firebase.database().ref(`drivers/readyToDrive/${driverID}`).set(driver)
                        .then(() => {
                            res.ref.set(null);
                            return delivered()
                                .then(res => {
                                    console.log('resssss ' + res)
                                    return res
                                })
                                .catch(err => {
                                    console.log(err)
                                    return false
                                })
                        })
                        .catch(err => {
                            console.log(err);
                            return false
                        })
                })
                .catch(err => {
                    console.log(err);
                    return false
                })
        })
        .catch(err => {
            console.log(err);
            return false
        })
}

const updateLocalStorage = () => {
    return
}

export default updateDriverStatus