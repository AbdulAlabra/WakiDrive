
import firebase from './Firebase';
import localStorage from './localStorage'


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
                restrictions: {
                    isRestricted: false,
                    reason: {
                        type: false,
                        message: false,
                        issuedDate: false,
                        isResolved: false,
                        resolvedDate: false,
                        references: false
                    },
                    resolvedRrestrictions: false
                }
            },
            driverHistory: {
                canceledOrders: {
                    totalOrders: 0,
                },
                completedOrders: {
                    totalOrders: 0,
                    totalMoneyMade: 0
                },
                payment: {
                    paid: {
                        total: 0
                    },
                    notPaid: {
                        current: {
                            total: 0
                        },
                        PayPage: false,
                        overallTotal: 0,

                    },
                    paymentToDriver: {
                        current: {
                            total: 0,
                        },
                        overallTotal: 0,
                        PayPage: false,

                    }

                }
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
        localStorage.storeData("@addressVerified", false);
        console.log('SUCCESS');

        // Alert("SUCCESS", "account created", () => console.log('ok'), () => console.log('ok'))
    })
        .catch(err => console.log(err));
}



export default AddUser;


