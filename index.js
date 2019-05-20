/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
//console.log(NativeModules.Counter)
AppRegistry.registerComponent(appName, () => App);
