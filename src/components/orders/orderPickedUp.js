import firebase from '../Firebase'
import createOrderStatus from "./updateUnfulfilledOrders"
import moment from 'moment-timezone'
import localStorage from '../localStorage'

const updateOrderStatus = (status) => {
    return localStorage.retrieveData("@order")
        .then(order => {
            let orderID = order.orderID
            let time = moment().tz('Asia/Riyadh').format('YYYY-MM-DDTHH:mm:ss');
            return firebase.database().ref(`unfulfilled/${orderID}/orderStatus`).child("status").limitToLast(1).once("value", snapshot => {
            })
                .then(res => {
                    console.log(res.val())
                    let resObj;
                    // res.forEach(child => {

                    //     resObj = child.val()
                    // })
                    // let newStatus = data.status
                    // console.log(data)
                    // console.log(resObj)
                    // console.log("duhsusgyu")
                    // let newStatus = resObj.status
                    // let update = {
                    //     status,
                    //     time
                    // }
                    // newStatus.push(update)
                    // res.ref.child("status").update(newStatus)
                    // newStatus.push(update)
                    // return res.ref.update(update)
                    //     .then(() => {
                    //         createOrderStatus("continued")
                    //             .then(res2 => {
                    //                 return res2
                    //             })
                    //             .catch(err => {
                    //                 return false
                    //             })
                    //     })
                    //     .catch(err => {
                    //         console.log(err)
                    //         return err
                    //     })
                    return true
                })
                .catch(err => {
                    console.log(err)
                    return err
                })
        })
        .catch(err => {
            console.log(err)
            return false
        })

}

export default updateOrderStatus

