const newOrder = (refrence, driverID, location) => {
    const splitRefrence = refrence.split("/")
    const phoneNumber = splitRefrence[1];
    const orderID = splitRefrence[2];
    let url = `https://us-central1-wakidrive-production.cloudfunctions.net/DriversAPI/destination/new?location=${location}&phone=${phoneNumber}&id=${driverID}&orderID=${orderID}`
    debugger
    return fetch(url)
        .then(res => {
            return res.json()
                .then(result => {
                    console.log("---NEW DESTENATION---")
                    console.log(result)
                    console.log("----NEW DESTENATION---")
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

export default newOrder
