import React, { Component } from 'react'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import HomePage from "./screens/HomePage";
import SignUp from "./screens/SignUp"
import SignUpForm from "./components/SignUpForm"
import BackgroundFetch from "react-native-background-fetch";
import updateDriverLocation from "./components/background/Tasks"
console.disableYellowBox = true

//UqEfbPBnKIbaej6238UneRfCMrJ3

// BackgroundTask.define(async () => {
//   console.log("hiii")
//   firebase.database().ref(`backgroundTasks/location`).set({
//     location: "Location",

//     time: moment().format("LLL")
//   })
//   BackgroundTask.finish();

// })


const AppNavigation = createStackNavigator({
  Home: HomePage,
  SignUp: SignUp,
  SignUpForm: SignUpForm
});

const AppContainer = createAppContainer(AppNavigation)

class App extends Component {

  componentDidMount() {
    BackgroundFetch.configure({
      minimumFetchInterval: 15,     // <-- minutes (15 is minimum allowed)
      // Android options
      stopOnTerminate: false,
      startOnBoot: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
      requiresCharging: false,      // Default
      requiresDeviceIdle: false,    // Default
      requiresBatteryNotLow: false, // Default
      requiresStorageNotLow: false  // Default
    }, () => {
      console.log("[js] Received background-fetch event");
      // Required: Signal completion of your task to native code
      // If you fail to do this, the OS can terminate your app
      // or assign battery-blame for consuming too much background-time
      navigator.geolocation.watchPosition(position => {
        let driverLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        updateDriverLocation(driverLocation)
      }, err => console.log(err));

      BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
    }, (error) => {
      console.log("[js] RNBackgroundFetch failed to start");
    });
  }

  render() {
    return (
      <AppContainer />
    );
  }
};




export default App


