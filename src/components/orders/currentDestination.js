import localStorage from '../localStorage'




const currentDestination = () => {
    return localStorage.retrieveData('@currentOrder')
        .then(location => {
            // console.log(location)
            let storeLocation = location.storeLocation
            if (storeLocation) {
                return storeLocation
            }
            else {
                return location
            }

        })
        .catch(err => {
            console.log(err)
        })
}

export default currentDestination

