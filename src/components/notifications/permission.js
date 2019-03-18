import localStorage from '../localStorage'
import firebaseRN from 'react-native-firebase';
import firebase from 'firebase';

const checkPermission = () => {
    const enabled = firebaseRN.messaging().hasPermission().then(res => {
        console.log('is enabled :' + res);
        if (res) {
            getToken();
        } else {
            requestPermission();
        }
    })
        .catch(err => console.log(err))
}

//3
const getToken = () => {
    localStorage.retrieveData("fcmToken")
        .then(response => {
            if (!response) {
                let getFcmToken = firebaseRN.messaging().getToken()
                    .then(FCMToken => {
                        console.log('from FCM');
                        console.log(FCMToken)
                        localStorage.storeData("fcmToken", FCMToken)
                            .then(dataStored => {
                                console.log('TOKEN is Stored successfully')
                                saveToDataBase(dataStored);

                                return;
                            })
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));
            }
            else {
                console.log('Token is already stored here it is :')
                console.log(response);
                saveToDataBase(response);
                return;
            }
        })
        .catch(err => console.log(err))

}

//2
const saveToDataBase = (token) => {
    //setTimeOut Only For Testing..
    // setTimeout(() => {
        const db = firebase.database();
        const driverID = firebase.auth().currentUser;
        console.log(driverID);
        if (driverID) {
        db.ref(`drivers/registeredDrivers/${driverID.uid}/driverInfo`).update({
            token: token
        });
    }
    // }, 10000)
}
const requestPermission = () => {
    firebaseRN.messaging().requestPermission()
        .then(() => {
            console.log('permission authorised :)')
            console.log(userResponse);
            getToken();
        })
        .catch(err => console.log('permission rejected :('));
}

export default checkPermission
