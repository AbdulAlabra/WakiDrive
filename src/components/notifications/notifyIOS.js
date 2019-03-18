import firebase from "../Firebase"
import Alert from "../Alert"
import findBestDriver from '../findCloseDriver';
import localStorage from '../localStorage'
import unfulfilled from '../Unfulfilled';

var db = firebase.database();

var arrayOfKeys = [];

const NewData = (cb, cb2, cb3) => {
    db.ref('buyers/').on('child_changed', (snapshot) => {
        const currentDriver = firebase.auth().currentUser;
        snapshot.forEach(function (child) {
            arrayOfKeys.push(child.key);
        });
        const result = snapshot.val();
        const key = arrayOfKeys[arrayOfKeys.length - 1];
        const data = result[key];
        const phone = data.BuyerInfo.phone
        const name = data.BuyerInfo.name;
        var buyerLocation = data.BuyerLocation;
        // const doesOrderHasDriver = data.orderInfo.driver.hasDriver;


        const orderRefrence = `buyers/${phone}/${key}/stores`;
        const buyerInfoRefrence = `buyers/${phone}/${key}/BuyerInfo`;
        const buyerLocationRefrence = `buyers/${phone}/${key}/BuyerInfo`;

        // console.log(data);
        console.log(key);
        console.log(orderRefrence);
        // console.log(doesOrderHasDriver);
        if (currentDriver !== null) {
            unfulfilled(key);
            findBestDriver(orderRefrence, (drivers, allresult) => {
                const isThisDriverInArray = drivers.find(thisDriver => {
                    if (thisDriver.driver.driverID === currentDriver.uid) {
                        db.ref(`unfulfilled/${key}`).set(drivers)
                            .then(() => {
                                console.log('unfifleed ordere is added')
                                localStorage.retrieveData('listening')
                                    .then(res => {
                                        if (res) {
                                            res.urls.push(`unfulfilled/${key}`)
                                            localStorage.storeData('listening', res)
                                                .then(newData => {
                                                    console.log(newData);
                                                })
                                                .catch(err => console.log(err))
                                        }
                                        else {
                                            var tempObj = {
                                                urls: [`unfulfilled/${key}`]
                                            }
                                            localStorage.storeData('listening', tempObj).then(NewData => {
                                                console.log(NewData);
                                            }).catch(err => console.log(err));
                                        }
                                    }).catch(err => console.log(err));

                            }).catch(err => console.log(err));
                    }
                    // return thisDriver.driver.driverID === currentDriver.uid
                });
                // db.ref(`unfulfilled/${key}`).limitToFirst(1).orderByChild('driver/driverID').equalTo(currentDriver.uid).once('value', function(snapshot){
                //     console.log(snapshot.val())
                //     console.log(currentDriver.uid);
                // })

              


                // var x = 0;
                // var y = 0;
                // var driver = result[x].driver;
                // var driverID = driver.driverID;
                // var driverLocation = driver.driverLocation;
                // var store = result[x].order;
                // var storeLocation = store[y].storeLocation;
                // var storeName = store[y].storeName;
                // console.log(result)
                // console.log('------------------------')
                // console.log(allresult)
                // console.log('driverID :' + driverID);
                // console.log('driverLocation : ')
                // console.log(driverLocation)
                // console.log('storeName : ' + storeName)
                // console.log('storeLocation :')
                // storeLocation.latitude = Number(storeLocation.latitude);
                // storeLocation.longitude = Number(storeLocation.longitude);
                // console.log(storeLocation)
                // buyerLocation.latitude = Number(buyerLocation.latitude)
                // buyerLocation.longitude = Number(buyerLocation.longitude);
                //good to use for one time use
                // if (currentDriver.uid === driverID) {
                //     Alert('New Order!', 'Phone: ' + phone + "\nName :" + name,
                //         () => {
                //             OnPressOK(cb)
                //             cb2(buyerLocation)
                //             cb3(storeLocation);
                //         },
                //         () => OnPressCancel()
                //     )
                // }
                // else {
                //     Alert('Sorry', 'you are not the closest driver', () => console.log('ok'), () => console.log('cancel'), 'ok', 'cancel')

                // }
                //good to use for one time use



            }); // end of find best driver









            //-----------Maybe important

            // db.ref(`drivers/readyToDrive/${currentDriver.uid}`).once('value', function (driverData) {
            //     if (driverData.val() !== null) {
            //         var name = data.BuyerInfo.name;
            //         var phone = data.BuyerInfo.phone
            //         var userLocation = {
            //             latitude: Number(data.BuyerLocation.latitude),
            //             longitude: Number(data.BuyerLocation.longitude),
            //             latitudeDelta: 0.0622,
            //             longitudeDelta: 0.001
            //         }
            //         //problem is here:
            //         var storeLocation = {
            //             latitude: Number(data.orderInfo.storeLocation.latitude),
            //             longitude: Number(data.orderInfo.storeLocation.longitude)
            //         }

            //         // loopThroughColsestDrivers(storeLocation, userLocation, driverData, currentDriver, name, phone, key, cb, cb2, cb3);
            //     } //end of 2nd if

            //     else {
            //         console.log('this user is not ready to drive');
            //         return;
            //     }

            // }); // end of readyToDrive
            //-----------Maybe important
        } // end of if
        else {
            console.log("Sign in or Sign up please");
            return;
        }
    });
}
//end of newOrder
const bestDrivers = (array, index, storesIndex, buyerLocation, phone, name, orderKey, cb, cb2, cb3) => {
    var doesOrderHaveDriver = false;
    console.log(array);
    console.log("index : " + index);
    console.log('storeIndex :' + storesIndex);
    const currentDriver = firebase.auth().currentUser
    var driver = array[Number(index)].driver;
    var driverID = driver.driverID;
    var store = array[Number(index)].order;
    var storeLocation = store[Number(storesIndex)].storeLocation;
    var storeName = store[storesIndex].storeName;
    console.log('driverID :' + driverID);
    console.log('storeLocation :')
    console.log(storeLocation);

    if (currentDriver.uid === driverID) {
        doesOrderHaveDriver = true;
        Alert('New Order!', 'Phone: ' + phone + "\nName :" + name,
            () => {
                storeLocation.latitude = Number(storeLocation.latitude);
                storeLocation.longitude = Number(storeLocation.longitude);

                buyerLocation.latitude = Number(buyerLocation.latitude)
                buyerLocation.longitude = Number(buyerLocation.longitude);

                OnPressOK(cb)
                cb2(buyerLocation)
                cb3(storeLocation);
                return;
            },
            () => {
                array.splice(array[0], 1);
                db.ref(`unfulfilled/${orderKey}`).set(
                    array
                )
                    .then(() => console.log('success unfulfilled'))
                    .catch(err => console.log(err))
                bestDrivers(array, index + 1, storesIndex, buyerLocation, cb, cb2, cb3)
            }
        )
    }
}



const directions = (originLocation, destinationLocation, DriverID, storeName, cb) => {
    fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${originLocation.latitude},${originLocation.longitude}&destination=${destinationLocation.latitude},${destinationLocation.longitude}&key=${APIkey}`)
        .then(res => {
            res.json().then(result => {
                isDone = true;
                const addressInfo = result.routes[0].legs[0];
                const distance = addressInfo.distance.text;
                const distanceValue = addressInfo.distance.value;
                const duration = addressInfo.duration.text;
                const durationValue = addressInfo.duration.value;
                // console.log('\n___________________' + DriverID + '_______________________\n');
                // console.log(distance)
                // console.log(distanceValue)
                // console.log(duration)
                // console.log(durationValue)
                // console.log('------------------------------------------');
                // console.log('DriverID :' + DriverID);
                // console.log('originLocation:')
                // console.log(originLocation);
                // console.log(addressInfo.start_address)
                // console.log(addressInfo.start_location)
                // console.log('------------------' + storeName + '------------------------');
                // console.log('destinationLocation :')
                // console.log(destinationLocation);
                // console.log(addressInfo.end_address);
                // console.log(addressInfo.end_location);
                // console.log('_____________________' + storeName + '_____________________\n');

                cb(durationValue, duration, DriverID, storeName);

            });
        }).catch(err => console.log(err));

}
const checkOrder = (phoneNumber, orderID) => {
    var doesOrderHasDriver = null;
    const driverID = firebase.auth().currentUser.uid;
    db.ref(`buyers/${phoneNumber}/${orderID}`).once('value', function (data) {
        const result = data.val();
        const hasDriver = result.orderInfo.driver.hasDriver;
        if (hasDriver) {
            doesOrderHasDriver = true;
            Alert("It's Too Late !", "\n You missed the order. Someone else picked it up.\n No worries we have planty of orders to come", () => console.log('ok'), () => console.log('cancel'))
        }
        else {
            doesOrderHasDriver = false
            db.ref(`buyers/${phoneNumber}/${orderID}/orderInfo/driver`).set({
                driverID: driverID,
                hasDriver: true
            })
                .then(() => {
                    console.log('order is assigned to this driver ID ' + driverID);
                    requestCompleted = true
                    return doesOrderHasDriver;
                })
                .catch(err => console.log(err));
        }

    })
        .then(() => console.log('success'))
        .catch(err => console.log(err));
    return doesOrderHasDriver
}
const OnPressOK = (cb) => {
    navigator.geolocation.getCurrentPosition(position => {
        var driverLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        cb(driverLocation);
    });
}

const OnPressCancel = () => {
    Alert("Are You Sure You Don't Want to Make Money?", "\n You are leaving money on the table !", () => console.log('ok'), () => console.log('cancel'))
}




export default NewData