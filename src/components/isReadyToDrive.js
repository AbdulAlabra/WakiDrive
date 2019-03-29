import localStorage from './localStorage'
import firebase from './Firebase'
import Alert from './Alert'
const db = firebase.database();

const readyToDrive = (status) => {
    return localStorage.retrieveData('@driverID')
        .then(driverID => {
            if (driverID) {
                if (status) {
                     db.ref(`drivers/registeredDrivers/${driverID}`).once('value', function (data) {
                        var token = ""
                        localStorage.retrieveData('@fcmToken').then(res => {
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
                        }); //end of location
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
                messege('please sign up to start driving', "");
            }
        })
        .catch(err => {
            console.log(err);
            return false
        })
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