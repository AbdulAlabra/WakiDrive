import firebase from './Firebase';


const AddUser = (userId, firstName, lastName, phone, email, password) => {
    firebase.database().ref(`drivers/registeredDrivers/${userId}`).set(
        {
            driverInfo: {
            firstName,
            lastName,
            phone,
            email,
            password
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
                },
                completedOrders: {
                    totalOrders: 0,
                },
                totalMoneyMade: 0
                
            }
            
        }
    ).then(res =>{

        console.log(res)
        console.log('SUCCESS');
    })
    .catch(err => console.log(err));
}



export default AddUser;


