import firebase from '../Firebase'
import localStorage from "../localStorage"


const restrictionsDB = () => {

    return localStorage.retrieveData("@driverID")
        .then(driverID => {
            return firebase.database().ref(`drivers/registeredDrivers/${driverID}/driverStatus/restrictions/isRestricted`).on("value", snapshot => {
                let isRestricted = snapshot.val()
                if (isRestricted === true) {
                     snapshot.ref.parent.child("reason").once("value", snapshot => {
                    }).then(res => {
                        let reason = res.val()
                        let type = reason.type
                        let message = reason.message
                        let issuedDate = reason.issuedDate
                        let references = reason.references
                        let isResolved = reason.isResolved
                        let resolvedDate = reason.resolvedDate
                        return { type, message, issuedDate, references }
                    }).catch(err => {
                        console.log(err)
                        return false
                    })
                }
                else {
                    return false
                }
            });
        })
        .catch(err => {
            console.log(err)
            return false
        })
}

export default restrictionsDB