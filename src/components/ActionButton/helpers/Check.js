import localStorage from '../../localStorage'

const check = (keySearch) => {
    return localStorage.retrieveData("@" + keySearch)
        .then(res => {
            console.log(res);
            if (res) {
                return res
            }
            else {
                return false
            }
        })
        .catch(err => {
            console.log(err)
            return false
        });
}


export default check