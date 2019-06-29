
const newDriver = (firstName, lastName, phone, email, password, fcmToken, token) => {
    let url = `https://us-central1-wakidrive-production.cloudfunctions.net/DriversAPI/driver/new?fcmToken=${fcmToken}&token=${token}&password=${password}&email=${email}&phone=${phone}&firstName=${firstName}&lastName=${lastName}`
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


export default newDriver
