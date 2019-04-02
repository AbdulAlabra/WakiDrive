import Auth from './auth';
import Alert from './Alert';
import AddUser from './Database'
import localStorage from './localStorage'


const FormValidation = (firstName, lastName, phone, email, password, cb) => {
    // something mybe wrong here
    const verify = (x) => {
        let Fname = x.trim().split("")
        return x.length
    }
    // signIn(phone)
    // const test = firebase.auth().currentUser.sendEmailVerification().then(() => {
    //     console.log('Helllooo')

    // }).catch(err => {
    //     console.log(err)
    // })

    if (firstName.trim() === "" || verify(firstName) <= 2) {
        if (firstName.trim() === "") {
            Alert("Missing", 'First Name', () => console.log('ok'), () => console.log('cancel'))
        }
        else {
            Alert(false, 'First Name has to be more than 2 letters', () => console.log('ok'), () => console.log('cancel'))
        }
    }
    else if (lastName.trim() === "" || verify(lastName) <= 2) {
        if (lastName.trim() === "") {
            Alert("Missing", 'Last Name', () => console.log('ok'), () => console.log('cancel'))
        }
        else {
            Alert(false, 'Last Name has to be more than 2 letters', () => console.log('ok'), () => console.log('cancel'))
        }
    }
    else if (phone.trim() == "") {
        Alert(false, 'Phone Number', () => console.log('ok'), () => console.log('cancel'))
    }
    else if (email.trim() == "") {
        Alert(false, 'Email', () => console.log('ok'), () => console.log('cancel'))
    }
    else if (password.trim() == "") {
        Alert(false, 'Password', () => console.log('ok'), () => console.log('cancel'));
    }
    else {
        Auth(email, password, "signup", (userId) => {

            cb(userId)
            localStorage.retrieveData('@fcmToken')
                .then(token => {
                    if (token) {
                        AddUser(userId, firstName, lastName, phone, email, password, token);
                    }
                    else {
                        AddUser(userId, firstName, lastName, phone, email, password, false);
                    }
                })
                .catch(err => {
                    console.log(err)
                    AddUser(userId, firstName, lastName, phone, email, password, 'err');
                })
        }
        );

    }
}

export default FormValidation