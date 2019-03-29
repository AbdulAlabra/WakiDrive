import localStorage from '../localStorage'


const Update = () => {
    return localStorage.storeData('@isDrivingNow', false)
        .then(res => {
            return isOrder()
        })
        .catch(err => {
            console.log(err)
            return false
        })
}

const isOrder = () => {
    return localStorage.storeData('@order', false)
        .then(res => {
            return isCurrentOrder()
        })
        .catch(err => {
            console.log(err)
            return false
        })
}

const isCurrentOrder = () => {
    return localStorage.storeData('@currentOrder', false)
        .then(res => {
            return true
        })
        .catch(err => {
            console.log(err)
            return false
        })
}

export default Update