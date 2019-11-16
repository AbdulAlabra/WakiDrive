import firebase from '../Firebase'



const refreshedInfo = async () => {
    const user = firebase.auth().currentUser

    console.log("-----------")
    if (user) {
        const refreash = user.reload();
        
        return user.getIdTokenResult(true)
            .then(res => {
                console.log(res)
                return res
            })
            .catch(err => {
                console.log(err);
                return false
            })
    }
    else {
        return false
    }
}

export default refreshedInfo