



const isOrderFulfilled = async (orderID) => {
    return firebase.database().ref(`unfulfilled/${orderID}`).once('value')
        .then(result => {
            let order = result.val();
            let orderStatus = order.orderStatus;
            if (orderStatus === "new" || orderStatus === "unfulfilled") {
                return false;
            }
            else {
                //if it's true, it means that some one already took it.
                return true;
            }

        })
        .catch(err => console.log(err));
}


export default isOrderFulfilled

