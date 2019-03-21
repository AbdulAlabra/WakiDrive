
import Alert from '../../Alert'

const showAlert = (title, body, orderID)  => {
    if (orderID === false) {
        Alert(title, body, () => this.setState({ isNotificationOpened: false }), () => this.setState({ isNotificationOpened: false }));
        return;
    }
    else {
        Alert(title, body, () => this.onPressOk(orderID), () => console.log('cancel'))
        return;
    }
}



export default showAlert

