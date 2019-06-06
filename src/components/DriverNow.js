import firebase from './Firebase'
import Alert from './Alert'
import moment from 'moment';
import localStorage from './localStorage'

const db = firebase.database();

const CheckDriver = (status, done) => {
    const currentDriver = firebase.auth().currentUser;
    if (currentDriver !== null) {
        const driverID = currentDriver.uid
        //when driver click on the car icon
        if (done === undefined) {
            Alert(
                'Welcome',
                "let's drive !",
                () => {
                    readyToDrive(status)
                },
                () => console.log('cancel'))
        }
        else {
            Alert(
                'You Made 20 SAR !',
                'Keep Driving And Make More',
                () => {
                    UpdateDriverStatus(driverID)
                },
                () => {
                    UpdateDriverStatus(driverID)
                }
            )
        }
    }
    else {
        Alert('Oh Sign Up', "or Login", () => console.log('ok'), () => console.log('cancel'))
    }
}

const readyToDrive = (status) => {
    const currentDriver = firebase.auth().currentUser;
    const driverID = currentDriver.uid
    console.log(driverID);

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
                    .then(() => console.log('driver is ready to drive'))
                    .catch(err => console.log(err));
                // end of set
            }, err => console.log(err), { maximumAge: 0, enableHighAccuracy:true }); //end of location
        }); // end of registeredDrivers
    }

    // end of if
    else {
        db.ref(`drivers/readyToDrive/${driverID}`).set(null)
            .then(() => console.log('driver is deleted from readyToDrive'))
            .catch(err => console.log(err));
    }

}

const UpdateDriverStatus = driverID => {
    db.ref(`drivers/drivingNow/${driverID}`).once("value", function (data) {
        db.ref(`drivers/readyToDrive/${driverID}`).set(data.val())
            .then(() => db.ref(`drivers/drivingNow/${driverID}`).set(null)
                .then(() => console.log('driver deleted from driving now'))
                .catch(err => console.log(err)))
            .catch(err => console.log(err))
    })
        .then(() => UpdateDriverHistory(driverID))
        .catch(err => console.log(err))
}
const UpdateDriverHistory = driverID => {
    db.ref(`drivers/registeredDrivers/${driverID}/driverHistory/completedOrders/orders/${getDate()}`).push().update({
        time: '1 hour',
        moneyMadeToday: 20,
        day: moment().format('LLLL'),
    })
        .then(() => {
            console.log('driver history updated')
            updateTotalOrdersAndMonyMade(driverID);
        })
        .catch(err => console.log(err))
}
const getDate = () => {
    var date = moment().format('L');
    var splitDate = date.split('/');
    var currentDate = '';
    var x = 0

    var newDate = splitDate.map(index => {
        x++
        if (x < splitDate.length) {
            currentDate += index + '-'
            return currentDate
        }
        else {
            currentDate += index
            return currentDate
        }
    });
    currentDate.trim();
    return currentDate
}
const updateTotalOrdersAndMonyMade = driverID => {
    db.ref(`drivers/registeredDrivers/${driverID}/driverHistory/completedOrders/totalOrders`).once("value", function (data) {
        db.ref(`drivers/registeredDrivers/${driverID}/driverHistory/completedOrders/totalOrders`).set(data.val() + 1)
            .then(() => console.log('total is updated'))
            .catch(err => console.log(err));

    }).then(() => {
        updateMoneyMadeToday(driverID);
        updateOverallMoneyMade(driverID);
    })
        .catch(err => console.log(err));
}
const updateMoneyMadeToday = driverID => {
    db.ref(`drivers/registeredDrivers/${driverID}/driverHistory/completedOrders/orders/${getDate()}/moneyMadeToday`).once('value', function (data) {
        if (data.val() !== null) {
            db.ref(`drivers/registeredDrivers/${driverID}/driverHistory/completedOrders/orders/${getDate()}/moneyMadeToday`).set(data.val() + 20)
                .then(() => {
                    console.log('20$ is added')
                    totalOrdersToday(driverID, false);
                })
                .catch(err => console.log(err));
        }
        else {
            db.ref(`drivers/registeredDrivers/${driverID}/driverHistory/completedOrders/orders/${getDate()}/moneyMadeToday`).set(20)
                .then(() => {
                    console.log('moneyMadeToday is set to 20')
                    totalOrdersToday(driverID, true);

                })
                .catch(err => console.log(err));
        }
    })
        .then(() => console.log('Money update success'))
        .catch(err => console.log(err));
}
const totalOrdersToday = (driverID, isFirstOrder) => {
    if (isFirstOrder) {
        db.ref(`drivers/registeredDrivers/${driverID}/driverHistory/completedOrders/orders/${getDate()}/totalOrdersToday`).set(1)
            .then(() => console.log('totalOrdersToday Updated'))
            .catch(err => console.log(err))
    }
    else {
        db.ref(`drivers/registeredDrivers/${driverID}/driverHistory/completedOrders/orders/${getDate()}/totalOrdersToday`).once('value', function (data) {
            db.ref(`drivers/registeredDrivers/${driverID}/driverHistory/completedOrders/orders/${getDate()}/totalOrdersToday`).set(data.val() + 1);

        })
            .then(() => console.log('totalOrdersToday Updated'))
            .catch(err => console.log(err))
    }
}
const updateOverallMoneyMade = driverID => {
    db.ref(`drivers/registeredDrivers/${driverID}/driverHistory/totalMoneyMade`).once('value', function (data) {
        if (data.val() === 0) {
            db.ref(`drivers/registeredDrivers/${driverID}/driverHistory/totalMoneyMade`).set(20)
                .then(() => console.log('totalMoneyMade is set to 20'))
                .catch(err => console.log(err))
        }
        else {
            db.ref(`drivers/registeredDrivers/${driverID}/driverHistory/totalMoneyMade`).set(data.val() + 20)
                .then(() => console.log('totalMoneyMade is set to ' + data.val() + 20))
                .catch(err => console.log(err))
        }
    })
        .then(() => console.log('success'))
        .catch(err => console.log(err));
}



export default CheckDriver

