
import firebase from './Firebase';
import geolib from 'geolib';

var db = firebase.database();

const findCloseDriver = (storeLocation, cb) => {
    var db = firebase.database();
    var driverScoreAndIDs = [];
    db.ref(`drivers/readyToDrive`).once("value", function (data) {
        data.forEach(function (child) {
            var driverLocation = child.val().driverLocation;
            driverScoreAndIDs.push({
                driverID: child.key,
                driverLocation: driverLocation,
                closedAppAt: child.val().closedAppAt,
                indexSum: 0,
                distance: geolib.getDistance(driverLocation, storeLocation)
            });
        });
    })
        .then(() => {
            driverScoreAndIDs.sort((a, b) => a.distance - b.distance);
            cb(driverScoreAndIDs);

        })
        .catch(err => console.log(err));
}

const loopThrougStoresAndDrivers = (dbRef, cb) => {
    var arrayOfStoresAndDrivers = [];
    var db = firebase.database();

    db.ref(dbRef).once('value', function (snapshot) {
        var x = 0
        var stores = snapshot.val();
        snapshot.forEach(function (child) {
            var key = child.key
            var storeLocation = stores[key].storeLocation;
            findCloseDriver(storeLocation, sortedDriverWithID => {
                x++
                // console.log('\n------------------' + stores[key].storeName + '------------------------')
                // console.log(sortedDriverWithID);
                // console.log('------------------' + stores[key].storeName + '------------------------\n')
                arrayOfStoresAndDrivers.push([stores[key], sortedDriverWithID])
                if (x === snapshot.numChildren()) {
                    x = 0;
                    reduceWay(arrayOfStoresAndDrivers, cb)
                }
            });
        });
    });
    
}


const reduceWay = (arrayOfStoresAndDrivers, cb) => {
    // console.log(arrayOfStoresAndDrivers)
    const storesToDriverSorting = arrayOfStoresAndDrivers.reduce((newArray, currentArray) => {
        
        var storesArray = currentArray[0];
        // var driversArray = currentArray[1];
        const updateDriverIndex = currentArray[1].map( currentDriver => {
            var currentDriverID = currentDriver.driverID;
            var currentIndex = currentArray[1].indexOf(currentDriver);
            if (arrayOfStoresAndDrivers.indexOf(currentArray) !== 0) {            
                const updateDriverIndex = newArray.find(driver => {
                    if (driver.driver.driverID === currentDriverID) {
                        driver.order.push(storesArray);
                        return driver.driver.driverScore =  Number(driver.driver.driverScore) + Number(currentIndex) ;
                    }
                });
            }
            else {
                var driverObj = {
                    driverID: currentDriverID,
                    driverLocation: currentDriver.driverLocation,
                    driverScore: currentIndex,
                    closedAppAt: currentDriver.closedAppAt
                }
                return newArray.push({ driver : driverObj, order: [storesArray] });
            }

        });
        return newArray;
    }, [])
 
    storesToDriverSorting.sort((a, b) => a.driver.driverScore - b.driver.driverScore);
    cb(storesToDriverSorting, arrayOfStoresAndDrivers);
    console.log('done')
}


export default loopThrougStoresAndDrivers





