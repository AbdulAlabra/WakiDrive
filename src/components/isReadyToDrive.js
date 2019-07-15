import localStorage from './localStorage'
import firebase from './Firebase'
import Alert from './Alert'
import firebaseRN from "react-native-firebase";

const db = firebase.database();

const readyToDrive = (status) => {
    const auth = firebase.auth()
    const driverID = auth.currentUser.uid;
    const userUpdate = auth.currentUser.reload();
    const token = auth.currentUser.getIdTokenResult(true)
    .then(res => {
        console.log(res);
        console.log(res.token);
    })
    .catch(err => {
        console.log(err)
    })


    console.log("driverID " + driverID);

    if (driverID) {
        if (status) {
            db.ref(`drivers/registeredDrivers/${driverID}`).once('value', function (data) {
                var token = ""
                localStorage.retrieveData('@fcmToken').then(res => {
                    console.log("fcmToken " + res);
                    if (res) {
                        token = res;
                    }
                    else {
                        token = null;
                    }
                }).catch(err => console.log(err));
                const result = data.val();
                const name = result.driverInfo.firstName;
                const phone = result.driverInfo.phone;
                const email = result.driverInfo.email;

                const car = result.driverStatus.car;
                const model = result.driverStatus.model;
                navigator.geolocation.getCurrentPosition(position => {
                    const driverLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                    db.ref(`drivers/readyToDrive/${driverID}`).set(
                        {
                            name,
                            closedAppAt: {
                                isActiveNow: true
                            },
                            phone,
                            email,
                            car,
                            model,
                            driverID,
                            driverLocation,
                            token
                        }
                    )
                        .then(() => {
                            saveStatus(status)
                            messege("Welcome & Let's drive !", "Just be around your phone we will give an order soon")

                            console.log('driver is ready to drive')
                        })
                        .catch(err => console.log(err));
                    // end of set
                }, err => console.log(err), { maximumAge: 0, enableHighAccuracy: true }); //end of location
            }); // end of registeredDrivers
        }

        // end of if
        else {
            db.ref(`drivers/readyToDrive/${driverID}`).set(null)
                .then(() => {
                    saveStatus(status)
                    messege('Good Buy :)', "Thanks for driving with us")
                    console.log('driver is deleted from readyToDrive')
                })
                .catch(err => console.log(err));
        }

    }
    else {
        messege('please sign up or sign in to start driving', "");
    }
}

const messege = (body, title) => {
    Alert(body, title, () => console.log('ok'), () => console.log('cancel'))
}

const saveStatus = (status) => {

    localStorage.storeData('@isReadyToDrive', status)
        .then(res => console.log('Is Driver Ready to drive ' + status))
        .catch(err => console.log(err));
}


export default readyToDrive