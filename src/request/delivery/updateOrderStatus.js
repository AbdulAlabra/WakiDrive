
const updateOrder = (refrence, driverID, opreation, location, orderIndexToUpdate) => {
    const splitRefrence = refrence.split("/")
    const phoneNumber = splitRefrence[1];
    const orderID = splitRefrence[2]
    let url = `https://us-central1-wakidrive-production.cloudfunctions.net/DriversAPI/destination/update?location=${location}&phone=${phoneNumber}&id=${driverID}&orderID=${orderID}&destenationIndex=${orderIndexToUpdate}&opreation=${opreation}`
    return fetch(url)
        .then(res => {
            return res.json()
                .then(result => {
                    console.log(result)
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


export default updateOrder
