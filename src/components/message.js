import Alert from "./Alert"

const message =  (title, body, cbOK, cbCancel) => {
    Alert(title, body, () => cbOK || console.log("ok"), () => cbCancel || console.log("cancel"))
}

export default message
