import Auth from './auth';
import Alert from './Alert';
import AddUser from './Database'
import localStorage from './localStorage'

const FormValidation = (firstName, lastName, phone, email, password, cb) => {
    if (firstName.trim() === "") {
        Alert(false, 'First Name', () => console.log('ok'), () => console.log('cancel'))
    }
    else if (lastName.trim() == "") {
        Alert(false, 'Last Name', () => console.log('ok'), () => console.log('cancel'))
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
            console.log('hello from validate')
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