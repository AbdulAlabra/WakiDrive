import firebase from "./Firebase";
import Alert from "./Alert"


const Authentication = (email, password, TypeOfOpreation, cb) => {
    if (TypeOfOpreation === "signup") {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((user) => {
                
                cb(user.user.uid)
                firebase.auth().signInWithEmailAndPassword(email, password)
                    .then((user) => {
                        console.log("user is Signed in")
                        console.log(user)
                    })
                    .catch((err) => {
                        console.log('something is wrong with signning in')
                        console.log(err)
                    });
            })
            .catch((err) => Alert(false, String(err), () => console.log('ok'), () => console.log('cancel')));
    }
    else {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
                console.log("user is Signed in")
                console.log(user)
                cb()
            })
            .catch((err) => {
                console.log('something is wrong with signning in')
                Alert(false, err.message, () => console.log('ok'), () => console.log('cancel'))
                console.log(err)
            });
    }


}




export default Authentication;

