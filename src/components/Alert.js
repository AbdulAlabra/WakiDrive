import { Alert } from 'react-native'

const CustomAlert = (field2, field, cbOK, cbCancel, ok, cancel) => {
    Alert.alert(
        field2 || 'Missing Field',
        field,
        [
          { text: cancel || 'Cancel', onPress: () =>  cbCancel() },
          { text: ok || 'OK', onPress: () =>  cbOK() }
        ],
        { cancelable: false }
      )
}

export default CustomAlert;