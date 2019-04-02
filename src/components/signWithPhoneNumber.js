import RNFirebase from 'react-native-firebase'

const signIn = (phoneNumber) => {
    RNFirebase.auth().signInWithPhoneNumber(phoneNumber)
        .then(confirmResult => {
            console.log(confirmResult)
            //codeInput
            confirmResult.confirm(codeInput)
                .then(user => {
                    console.log(user)
                }) // User is logged in){
                .catch(error => {
                    console.log(error)
                })
        })
        .catch(error => {
            console.log(error)
        });
}

export default signIn
