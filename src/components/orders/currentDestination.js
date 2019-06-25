import localStorage from '../localStorage'



const currentDestination = () => {
    return localStorage.retrieveData('@currentOrder')
        .then(location => {
            console.log("--------")
            console.log(location)
            console.log("-------")
            let storeLocation = location.location
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

