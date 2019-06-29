import firebase from "../../Firebase"
import Alert from "../../Alert"
const db = firebase.database()
//const message = (title, message) 
const watch = (driverID) => {
    return db.ref(`drivers/drivingNow/${driverID}/status/canceled`).on("value", (snap) => {
        let status = snap.val()
        let key = snap.key
        //if (key === "")
        //let message = status
        if (status === true) {

            //console.log(status)
            //console.log(key)
            console.log("-------")
            return "Yoooooo"
        }



    })
}




export default watch
