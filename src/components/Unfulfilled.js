import firebase from './Firebase';
import Alert from './Alert';
import moment from 'moment';

var db = firebase.database()

const unfulfilledOrders = (orderKey) => {
    const currentDriverID = firebase.auth().currentUser.uid;
    db.ref(`unfulfilled/${orderKey}`).limitToFirst(1).on('child_removed', function (snapshot) {
        var result = snapshot.val();
        var deletedDriverID = result.driver.driverID
        var nextBestDriver = Number(snapshot.key) + 1;

        console.log('this driver :\n' + deletedDriverID + '\n is removed from this order : ' + orderKey);
        console.log('------------------------')
        db.ref(`unfulfilled/${orderKey}/${nextBestDriver}/driver`).once('value', function (snapshot) {
            if (snapshot.val() !== null) {

                var resultID = snapshot.val().driverID;
                console.log('this driver :\n' + resultID + '\n is the next bestDriver fro this order : ' + orderKey);
                console.log('------------------------')
                if (resultID === currentDriverID) {
                    setTimeout(function () {
                        doesThisDriverExsist(orderKey, nextBestDriver, 'checkDriver');
                    }, 10000);

                    Alert('We Got an Order For you', "You are next Best Driver", () => {
                        db.ref(`unfulfilled/${orderKey}`).update({
                            isOrderPickedUp: true
                        });
                    },
                        () => doesThisDriverExsist(orderKey, nextBestDriver, 'checkDriver'));
                }

                else {
                    console.log('you are not the closest driver')
                    var isOrderPickedUp = false;
                    db.ref(`unfulfilled/${orderKey}`).on('child_changed', function (orderIsPickedUp) {
                        console.log('something is changed in unfulfilled')
                        console.log(orderIsPickedUp.key)
                        console.log(orderIsPickedUp.val());
                        if (orderIsPickedUp.key === orderKey) {
                            isOrderPickedUp = true;
                            console.log('isOrderPickedUp :' + isOrderPickedUp);
                        }
                        else {
                            isOrderPickedUp = false;
                            console.log('isOrderPickedUp :' + isOrderPickedUp);
                        }

                    }); // on chailed changed 

                    setTimeout(function () {
                        doesThisDriverExsist(orderKey, nextBestDriver, 'checkDriver');
                    }, 10000)

                    // Alert('You are Not the closest One yet', "We will find order for you", () => console.log('ok'), () => console.log('cancel'));
                }
            }
            else {
                console.log('all drivers are gone !');
            }
        })

    }); // on chiled removed end

    db.ref('unfulfilled/').orderByKey().startAt(orderKey).limitToFirst(1).on('child_added', function (snapshot) {
        //modifed unfafiled order
        console.log('new unfafiled order');
        var result = snapshot.val();
        var bestDriverID = result[0].driver.driverID
        console.log(snapshot.key);
        console.log(result);
        if (currentDriverID === bestDriverID) {
            setTimeout(function () {
                doesThisDriverExsist(orderKey, 0, 'checkDriver');
            }, 10000);

            Alert('We Got an Order For you', "You are next Best Driver", () => {
                db.ref(`unfulfilled/${orderKey}`).update({
                    isOrderPickedUp: true
                });
            },
                () => {
                    doesThisDriverExsist(orderKey, 0, 'checkDriver');
                });
        }
        else {
            setTimeout(function () {
                doesThisDriverExsist(orderKey, 0, 'checkDriver');
            }, 10000);
        }

    }); // on chiled added
}



const doesThisDriverExsist = (orderKey, driver, typeOfOpreation, cb) => {
    if (typeOfOpreation === 'checkDriver') {
        return db.ref(`unfulfilled/${orderKey}/${driver}`).once('value', isDriverDeleted => {
            if (isDriverDeleted.val() !== null) {
                console.log('driver is NOT deleted ');
                onPressCancel(orderKey, driver, doesDriverExcept => {
                    if(doesDriverExcept === false) {
                        console.log('order rejected by this driver index :' + driver);
                    }
                    else if (doesDriverExcept === true) {
                        console.log('order is accepted by this driver : ' + driver);
                    }
                });
                if (cb) {
                    return cb(true);
                }
            }
            else {
                console.log('order rejected by this driver index :' + driver);
                console.log('driver is already deleted ');
                if (cb) {
                    return cb(false)
                }

            }
        })
    }
    else if (typeOfOpreation === 'order') {
        return db.ref(`unfulfilled/${orderKey}`).once('value', function (snapshot) {
            if (snapshot.val() !== null) {
                return;
            }
            else {
                return;
            }
        });
    }

}


const onPressCancel = (orderKey, driver, cb) => {
    const driverID = firebase.auth().currentUser.uid;
    db.ref(`unfulfilled/${orderKey}`).once('value', function (snapshot) {
        if (snapshot.val() !== null) {
            if (snapshot.numChildren() === 1) {
                snapshot.forEach(child => {
                    if (child.key !== 'isOrderPickedUp') {
                        var lastDriverID = child.val().driver.driverID;
                        if (driverID === lastDriverID) {
                            var isOrderAceepted = undefined;
                            setTimeout(() => {
                                if (!isOrderAceepted) {
                                    db.ref(`unfulfilled/${orderKey}`).set({
                                        isOrderPickedUp: false
                                    });
                                }
                                else {
                                    return;
                                }
                            }, 10000);
                            Alert("YOU CANNOT CANCEL", "You must take this order\n otherwise you will be susbended for a week",
                                () => {
                                    isOrderAceepted = true;
                                    db.ref(`unfulfilled/${orderKey}`).update({
                                        isOrderPickedUp: true
                                    });
                                },
                                () => {
                                    isOrderAceepted = false;
                                    db.ref(`unfulfilled/${orderKey}`).set({
                                        isOrderPickedUp: false
                                    });
                                })

                        }
                        else {
                            setTimeout(function () {
                                db.ref(`unfulfilled/${orderKey}`).once('value', function (snapshot) {
                                    var result = snapshot.val()
                                    console.log(snapshot.val())
                                    if (snapshot.numChildren() === 1) {
                                        if (result.isOrderPickedUp !== null && result.isOrderPickedUp !== false) {
                                            console.log('order is picked Up !!!!!');
                                        }
                                        else {
                                            console.log(result.isOrderPickedUp)
                                            console.log('order is already order is picked up')
                                        }
                                    }
                                    else {
                                        if (result.isOrderPickedUp === true) {
                                            return;
                                        }
                                        else {
                                            db.ref(`unfulfilled/${orderKey}`).set({
                                                isOrderPickedUp: false
                                            })
                                                .then(() => console.log('isOrderPickedUp is set to false'))
                                                .catch(err => console.log(err));
                                        }
                                    }
                                })
                            }, 12000)
                        }
                    }
                    else {
                        return;
                    }
                });
            }
            else {
                if (snapshot.val().isOrderPickedUp === true) {
                    console.log('order is picked up !')
                    cb(true);
                    return;
                }
                else {
                    cb(false);
                    db.ref(`unfulfilled/${orderKey}/${driver}`).remove()
                        .then(() => console.log('driver is removed'))
                        .catch(err => console.log(err));
                }
            }
        }
        else {
            return;
        }

    });

}




export default unfulfilledOrders