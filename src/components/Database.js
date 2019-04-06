import React from 'react'
import firebase from './Firebase';
import localStorage from './localStorage'
import Alert from "./Alert"
import Modal from './Modal'

const AddUser = (userId, firstName, lastName, phone, email, password, token) => {
    firebase.database().ref(`drivers/registeredDrivers/${userId}`).set(
        {
            driverInfo: {
                firstName,
                lastName,
                phone,
                email,
                password,
                token
            },
            driverStatus: {
                car: false,
                model: false,
                phoneVerified: false,
                emailVerified: false,
            },
            driverHistory: {
                canceledOrders: {
                    totalOrders: 0,
                    totalMoneyMade: 0
                },
                completedOrders: {
                    totalOrders: 0,
                },
            }
        }
    ).then(res => {
        let driverID = firebase.auth().currentUser.uid

        localStorage.storeData('@driverID', driverID)
        localStorage.storeData('@account', true);
        localStorage.storeData("@isSignedIn", true);
        localStorage.storeData("@canDrive", false);
        localStorage.storeData("@phoneVerified", false);
        localStorage.storeData("@emailVerified", false);
        console.log('SUCCESS');

        // Alert("SUCCESS", "account created", () => console.log('ok'), () => console.log('ok'))
    })
        .catch(err => console.log(err));
}



export default AddUser;


