import localStorage from '../../localStorage'
import firebaseRN from 'react-native-firebase';

const checkPermission = () => {
    const enabled = firebaseRN.messaging().hasPermission().then(res => {
        if (res) {
            getToken();
        } else {
            requestPermission();
        }
    })
        .catch(err => console.log(err))
}

//3
const getToken = () => {
    let getFcmToken = firebaseRN.messaging().getToken()
        .then(FCMToken => {
            localStorage.storeData("@fcmToken", FCMToken)
                .then(dataStored => {
                    console.log('TOKEN is Stored successfully')                    
                    return;
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));

}



const requestPermission = () => {
    firebaseRN.messaging().requestPermission()
        .then(() => {
            console.log('permission authorised :)')
            console.log(userResponse);
            getToken();
        })
        .catch(err => console.log('permission rejected :('));
}

export default checkPermission
