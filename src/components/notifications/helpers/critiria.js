import localStorage from '../../localStorage';
import firebase from '../../Firebase'
import moment from 'moment-timezone'


const sortOrders = async () => {
    return localStorage.retrieveData('@driverID')
        .then(driverID => {
            if (driverID) {
                return firebase.database().ref(`orderListeners/${driverID}`).once('value', x => {
                }).then(snapshot => {
                    let orders = [];
                    snapshot.forEach(child => {
                        let orderID = child.key;
                        let order = child.val();
                        let dateTime = order.assignedAt;
                        let now = moment(moment().tz('Asia/Riyadh').format('YYYY-MM-DDTHH:mm:ss'))
                        let then = moment(dateTime);
                        let diff = now.diff(then, 'minutes')
                        order.orderID = orderID
                        order.timeDiff = diff
                        orders.push(order);
                    })
                    orders.sort((a, b) => a.driverIndex - b.driverIndex);
                    var bestOrders = orders.filter(order => {
                        return order.driverIndex === orders[0].driverIndex
                    });
                    bestOrders.sort((a, b) => a.timeDiff - b.timeDiff);
                    console.log(bestOrders);
                    return { orderRefrence: bestOrders[0].orderRefrence, orderID: bestOrders[0].orderID };
                })
                    .catch(err => {
                        console.log(err)
                        return false;
                    });
            }
            else {
                console.log('SOMETHING Wrong with FCM Token ');
            }
        }).catch(err => console.log(err));
}



export default sortOrders