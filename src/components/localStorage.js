

import  AsyncStorage  from '@react-native-community/async-storage';

var CRUD = {
    removeData: async (keyName) => {
        try {
            const value = await AsyncStorage.removeItem(keyName)
        }
        catch (err) {
            console.log(err)

        }
    },
    storeData: async (key, value) => {

        try {

            await AsyncStorage.setItem(key, JSON.stringify(value), () => {
                console.log('data is stored');
                return value;
            });
            return value;
        } catch (error) {
            console.log(error);
            // Error saving data
        }
    },
    retrieveData: async (key) => {
        try {
            
            const value = await AsyncStorage.getItem(key);
            if(value !== null) {
            const parsedValue = JSON.parse(value);
            console.log('item is retrived')
            return parsedValue;
            }
        } catch (error) {
            // Error retrieving data
            console.log(error);
        }
    }
}

export default CRUD
