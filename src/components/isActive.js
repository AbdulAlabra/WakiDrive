import firebase from './Firebase';
import moment from 'moment';
import localStorage from "./localStorage"
// import queueFactory from 'react-native-queue';

const db = firebase.database();
// const queue = queueFactory();

const isActive = (isActive) => {
    const currentUser = firebase.auth().currentUser
    if (isActive === 'active') {

        console.log('user is ' + isActive);

        localStorage.retrieveData('@isReadyToDrive')
            .then(isReadyToDrive => {
                localStorage.retrieveData('@driverID')
                .then(driverID => {
                    if (driverID && isReadyToDrive) {
                        db.ref(`drivers/readyToDrive/${driverID}/closedAppAt`).update({ isActiveNow: true })
                        return;
                    }
                })
                .catch(err => console.log(err));
               
            })
            .catch(err => console.log(err))

    }
    else if (isActive === 'background' || isActive === 'inactive') {
        console.log('user is in ' + isActive);
        localStorage.retrieveData('@isReadyToDrive')
            .then(isReadyToDrive => {
                localStorage.retrieveData('@driverID')
                .then(driverID => {
                    console.log('driverID ' + driverID);
                    if (isReadyToDrive && driverID) {
                        db.ref(`drivers/readyToDrive/${driverID}`).update({
                            closedAppAt: {
                                time: moment().format("LT"),
                                date: moment().format('L'),
                                isActiveNow: false
                            }
                        });
                    }
                })
                .catch(err => console.log(err))
             
            })
            .catch(err => console.log(err))
    }
    else {
        console.log('user is something :' + isActive);
    }
}


export default isActive;
