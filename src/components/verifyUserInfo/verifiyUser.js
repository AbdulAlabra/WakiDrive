import localStorage from '../localStorage'

const veriifyUser = () => {
    return localStorage.retrieveData("@account").then((account) => {
        console.log("account :" + account)
        if (account) {
            return localStorage.retrieveData("@isSignedIn").then((isSignedIn) => {
                console.log("isSignedIn :" + isSignedIn)

                if (isSignedIn) {
                    return localStorage.retrieveData("@phoneVerified").then((phoneVerified) => {
                        console.log("phoneVerified :" + phoneVerified)

                        if (phoneVerified) {
                            return localStorage.retrieveData("@emailVerified").then((emailVerified) => {
                                console.log(" emailVerified:" + emailVerified)

                                if (emailVerified) {
                                    return localStorage.retrieveData('@addressVerified').then(addressVerified => {
                                        console.log(addressVerified + ": addressVerified");
                                        if (addressVerified) {

                                            return 'verified'
                                        }
                                        else {
                                            return 'address'
                                        }
                                    }).catch(err => {
                                        console.log(err);
                                        return false
                                    })
                                }
                                else {
                                    return 'email'
                                }
                            }).catch(err => {
                                return false
                            })
                        }
                        else {
                            return 'phone'
                        }

                    }).catch(err => {
                        return false
                    })
                }
                else {
                    //user is logged out
                    return "loggedOut"
                }
            }).catch(err => {
                return false
            })
        }
        else {
            //no acct
            return "acct"
        }
    }).catch(err => {
        return false
    })
}


export default veriifyUser