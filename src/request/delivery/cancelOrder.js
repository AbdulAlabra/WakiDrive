
 import removeOrder from  "../../components/endJourney/updateLocalStorage"




const cancel = (refrence, driverID, issuer, timeZone, location) => {
    const splitRefrence = refrence.split("/")
    const phoneNumber = splitRefrence[1];
    const orderID = splitRefrence[2]
    let url = `https://us-central1-wakidrive-production.cloudfunctions.net/DriversAPI/destination/cancel?&location=${location||"no-location"}&issuer=${issuer}&timeZone=${timeZone}&phone=${phoneNumber}&id=${driverID}&orderID=${orderID}`
    return fetch(url)
        .then(res => {
            return res.json()
                .then(result => {
                    console.log(result)
                    removeOrder()
                    return result

                })
                .catch(err => {
                    console.log(err)
                    return false
                })
        })
        .catch(err => {
            console.log(err)
            return false
        })
}


export default cancel
