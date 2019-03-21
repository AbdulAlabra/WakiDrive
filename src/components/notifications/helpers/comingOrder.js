import Alert from '../../Alert'


const ListenToComingOrders = () => {
    localStorage.retrieveData('fcmToken')
        .then(token => {
            firebase.database().ref(`orderListeners/${token}`).on('child_added', (snapshot) => {
                let orderID = snapshot.key;
                let dbRef = snapshot.val();
                let prevNumber = this.state.totalOrders;
                this.setState({ totalOrders: prevNumber + 1 });
                this.isOrderFulfilled(orderID)
                    .then(status => {
                        if (status) {
                            //delete any order that is fulfilled
                            snapshot.ref.remove()
                                .then(() => this.showAlert('Firebase', "Delete " + orderID, false))
                                .catch(err => this.showAlert('Firebase', "Delete WRONG", false));

                        } else {
                            if (!this.state.isNotificationOpened) {
                                this.showAlert('Firebase', "New Order", false);
                                this.getOrderDetails(dbRef)
                            }

                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
        })
        .catch(err => console.log(err));
}

export default ListenToComingOrders
