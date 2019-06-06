import firebase from "../Firebase"
import localStorage from "../localStorage"
import moment from "moment-timezone"

const db = firebase.database()




const updateDriverLocation = (driverLocation) => {
  let locationTime = moment().tz('Asia/Riyadh').format('YYYY-MM-DDTHH:mm:ss');
    localStorage.retrieveData("@driverID")
    .then(driverID => {
      if (driverID) {
        db.ref(`drivers/readyToDrive/${driverID}`).once("value", snapshot => {
        }).then((res) => {

          if (res.val() !== null) {
            res.ref.update({ locationTime, driverLocation })
          }

          else {
            res.ref.parent.parent.child(`drivingNow/${driverID}`).once("value", snap => {
            }).then(driving => {
              if (driving.val() !== null) {
                // drivimng now
                driving.ref.update({ locationTime, driverLocation })
              }
              else {
                // he is not driving
                return false
              }
            })
              .catch(err => {
                console.log(err)
                return false
              })

            // not driving ready to drive
            return false
          }
        }).catch(err => {
          console.log(err);
          return false
        })
      }
      else {
        // not a driver
        return false
      }
    })
    .catch(err => {
      console.log(err)
      return false
    });
}


export default updateDriverLocation