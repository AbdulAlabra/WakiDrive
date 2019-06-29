import firebase from "./Firebase"

const auth = firebase.auth()

const status = auth.onAuthStateChanged((x) => {
    //console.log(x)
    return x
}, err => {
    console.log(err)

})

export default status
