import localStorage from '../localStorage'


const veriifyUser = () => {
    return localStorage.retrieveData("@account").then((account) => {
        if (account) {
            return localStorage.retrieveData("@isSignedIn").then((isSignedIn) => {
                if (isSignedIn) {
                    return localStorage.retrieveData("@phoneVerified").then((phoneVerified) => {
                        if (phoneVerified) {
                            return localStorage.retrieveData("@emailVerified").then((emailVerified) => {
                                if (emailVerified) {
                                    'verified'
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