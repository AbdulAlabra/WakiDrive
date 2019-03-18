import React, { Component } from 'react';
import Map from '../components/map'
import { Container } from 'native-base';
import Header from "../components/Header";
import SideMenu from './Menu'
import { View, Dimensions } from "react-native"
import { Marker } from 'react-native-maps';
import isDrivingNow from '../components/DriverNow';
import localStorage from '../components/localStorage'
// import permission from '../components/notifications/permission';
// import Notification from '../components/notifications/notification'
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
var LATITUDE_DELTA = 0.01;

const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


class HomePage extends Component {
  static navigationOptions = {
    header: null
  }
  state = {
    readyToDrive: true,
    newOrderRecived: false,
    isOrderedPickedUp: '',
    isOrderRecieved: false,
    title: 'WakiDrive',

    isOpen: false,
    rightIconColor: "#99ccff",
    region: null,
    buyer: "",
    store: "",
    driver: null
  }
  wasDriverReadyToDrive() {
    localStorage.retrieveData('@isReadyToDrive')
      .then(res => {
        if (res) {
          console.log('Was Driver Ready to drive ' + res)
          //this means the driver was on ReadyToDrive State
          this.setState({ rightIconColor: '#58D68D', readyToDrive: false })
        }
        else {
          console.log('Was Driver Ready to drive ' + res)
        }
      })
      .catch(err => console.log(err))

  }
  returnMarker() {
    if (this.state.newOrderRecived) {
      if (this.state.isOrderedPickedUp) {
        console.log('store to buyer');
        return (
          <View>
            <Marker title="Store" onPress={() => console.log('Marker is pressed')} coordinate={this.state.store} />
            <Marker title="Buyer" onPress={() => console.log('Marker is pressed')} coordinate={this.state.buyer} />
          </View>
        );
      }
      else if (!this.state.isOrderedPickedUp) {
        console.log('driver to store')
        return (
          <View>
            <Marker title="Driver" onPress={() => console.log('Marker is pressed')} coordinate={this.state.driver} />
            <Marker title="Store" onPress={() => console.log('Marker is pressed')} coordinate={this.state.store} />
          </View>
        );
      }

    }
    else {
      return
    }
  }

  componentDidMount() {
    // permission()
  }
  componentWillMount() {
    this.wasDriverReadyToDrive()
  }

  watchUserLocation() {
    navigator.geolocation.watchPosition(position => {
      this.setState({
        isOpen: false,
        region: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        },
        driver: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      });
    }, err => console.log(err));

  }

  isReadyToDrive(x) {
    if (x) {
      this.setState({ rightIconColor: '#58D68D', isOpen: false });
      isDrivingNow(x);

      localStorage.storeData('@isReadyToDrive', this.state.readyToDrive)
        .then(res => console.log('Is Driver Ready to drive ' + res))
        .catch(err => console.log(err));
    }
    else {
      localStorage.storeData('@isReadyToDrive', this.state.readyToDrive)
        .then(res => console.log('Is Driver Ready to drive ' + res))
        .catch(err => console.log(err));
      this.setState({
        rightIconColor: '#E74C3C',
        isOpen: false,
        newOrderRecived: false,
        isOrderedPickedUp: '',
        isOrderRecieved: false
      });
      isDrivingNow(x);
    }
  }
  isReadyToDrive2() {

    this.setState(prevState => ({
      readyToDrive: !prevState.readyToDrive
    }));
    this.isReadyToDrive(this.state.readyToDrive);
  }
  onLongPress() {
    if (this.state.readyToDrive === false && this.state.isOrderedPickedUp === false) {
      this.setState({ isOrderedPickedUp: true });
      console.log('order is picked up');
    }
    else if (this.state.isOrderedPickedUp === true) {
      console.log('order recived');
      this.setState({
        isOrderedPickedUp: '',
        newOrderRecived: false,
        readyToDrive: true,
        isOrderRecieved: false
      });
      isDrivingNow(this.state.readyToDrive, true);
    }
    else {
      console.log('no driver or you do not have an order');
      return;
    }
  }
  render() {
    return (
      <SideMenu isOpen={this.state.isOpen}>
        <Container>
          <Header
            title={this.state.title}
            rightIconName="car"
            rightIconColor={this.state.rightIconColor}
            // leftIconName="ios-menu"
            iconSize={30}
            onLongPressRight={() => console.log('right long press')}
            onPressTitle={() => console.log("title is pressed")}
            onPressRight={() => this.isReadyToDrive2()}
            onPressLeft={() => this.setState({ isOpen: true })}
            onLongPressTitle={() => this.onLongPress()}
          />
          <Map region={this.state.region}>
            {/* {this.returnMarker()}
            {DriverStorePolyLine(this.state.isOrderedPickedUp, this.state.driver, this.state.store)}
            {StoreBuyerPolyLine(this.state.isOrderedPickedUp, this.state.driver, this.state.buyer)} */}
            {this.watchUserLocation()}
          </Map>
          {/* <Notification /> */}
        </Container>
      </SideMenu>

    );
  }
}

export default HomePage