import firebase from "./Firebase";
import Alert from "./Alert"


const Authentication = (email, password, TypeOfOpreation, cb) => {
    if (TypeOfOpreation === "signup") {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((user) => {
                firebase.auth().signInWithEmailAndPassword(email, password)
                    .then((signedin) => {
                        cb(user.user.uid)
                        console.log("user is Signed in")
                        console.log(signedin)
                    })
                    .catch((err) => {
                        console.log('something is wrong with signning in')
                        cb(false)
                        console.log(err)
                    });
            })
            .catch((err) => {
                cb(false);
                Alert(false, String(err), () => console.log('ok'), () => console.log('cancel'))
            });
    }
    else {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
                console.log("user is Signed in")
                console.log(user)
                cb(user);
            })
            .catch((err) => {
                console.log('something is wrong with signning in')
                cb(false)
                Alert(false, err.message, () => console.log('ok'), () => console.log('cancel'))

                console.log(err)
            });
    }


}




export default Authentication;

