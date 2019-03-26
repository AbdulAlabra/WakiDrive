import localStorage from '../localStorage'
import moment from "moment-timezone"


const getDeliveryTime = () => {
    return localStorage.retrieveData('@expectedArrivalTime')
        .then(time => {
            let placedAt = time.placedAt;
            let expected = time.duration;
            let now = moment(moment().tz('Asia/Riyadh').format('YYYY-MM-DDTHH:mm:ss'))
            let then = moment(placedAt);
            let diff = now.diff(then, 'minutes')
           return validate(expected, diff);
        })
        .catch(err => {
            console.log(err);
        })
}

const validate = (expected, actual) => {
    let diffrence = actual / expected;
    let arrivalTime = 1 - diffrence;

    if (arrivalTime.toFixed(1) <= 0) {
        if (arrivalTime.toFixed(1) === 0) {
            console.log('On Time :)!');
            return true
        }
        else {
            console.log('LATE !');
            console.log('expected :' + expected)
            console.log('actual :' + actual)
            return true

        }
    }
    else {
        if (arrivalTime.toFixed(1) <= 0.5) {
            console.log('expected :' + expected)
            console.log('actual :' + actual)
            console.log('thats fast ');
            return true

        }
        else {
            console.log('expected :' + expected);
            console.log('actual :' + actual);
            console.log('very fast !!!!!');
            return false
        }
    }
}


export default getDeliveryTime