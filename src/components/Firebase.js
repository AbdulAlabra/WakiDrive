import * as firebase from "firebase";
import Config from 'react-native-config'
const DBconfig = {
  apiKey: Config.DB_API_KEY,
  authDomain: Config.DB_AUTH_DOMAIN,
  databaseURL: Config.DB_URL,
  projectId: Config.DB_PROJECT_ID,
  storageBucket: Config.DB_STORAGE_BUCKET,
  messagingSenderId: Config.DB_MESSAGING_SENDER_ID
};


export default !firebase.apps.length ? firebase.initializeApp(DBconfig) : firebase.app();