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
                car: "Honda",
                model: '2018',
                isReadyToDrive: false,
                isDrivingNow: false
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
    ).then(res =>{
        let driverID = firebase.auth().currentUser.uid
        
        localStorage.storeData('@driverID', driverID)
        console.log('SUCCESS');
    })
    .catch(err => console.log(err));
}



export default AddUser;


