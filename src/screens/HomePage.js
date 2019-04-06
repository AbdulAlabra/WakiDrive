import React, { Component } from 'react';
import { Container, View } from 'native-base';
import Header from "../components/Header";
import SideMenu from './Menu'
import { Dimensions } from "react-native"
import isDrivingNow from '../components/DriverNow';
import localStorage from '../components/localStorage'
import permission from '../components/notifications/helpers/permission';
import Notification from '../components/notifications/notification'
import nextTrip from '../components/orders/nextDestination';
import Alert from '../components/Alert'
import isReadyToDrive from '../components/isReadyToDrive'
import ActionButton from "../components/ActionButton/ActionButton"
import Verify from "../components/verifyUserInfo/ShowModal"

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
var LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


class HomePage extends Component {
  static navigationOptions = {
    header: null
  }
  state = {
    cords: '',
    coordinates: [],
    readyToDrive: true,
    newOrderRecived: false,
    isOrderedPickedUp: '',
    isOrderRecieved: false,
    isModalVisible: false,

    title: 'WakiDrive',
    nextTripAccepted: undefined,
    delivered: false,
    deliveredNum: 0,
    isOpen: false,
    rightIconColor: "#99ccff",
    region: null,
    buyer: "",
    store: "",
    driver: null,
    checkOrder: false
  }
  wasDriverReadyToDrive() {
    localStorage.retrieveData('@isReadyToDrive')
      .then(res => {
        if (res) {
          console.log('Was Driver Ready to drive ' + res)
          //this means the driver was on ReadyToDrive State
          this.setState({ rightIconColor: '#58D68D', readyToDrive: res })
          this.setState({ checkOrder: false })

        }
        else {
          this.setState({
            rightIconColor: '#E74C3C',
            readyToDrive: res
          });
          console.log('Was Driver Ready to drive ' + res)
        }
      })
      .catch(err => console.log(err))
  }
  componentDidMount() {
    permission()
  }
  componentWillMount() {
    this.wasDriverReadyToDrive()
  }
  watchUserLocation() {
    navigator.geolocation.watchPosition(position => {
      this.setState({
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
      isReadyToDrive(x);
    }
    else {
      this.setState({
        rightIconColor: '#E74C3C',
        isOpen: false,
      });
      isReadyToDrive(x);
    }
  }
  isReadyToDrive2() {
    this.setState({ isOpen: false })

    this.setState(prevState => ({
      readyToDrive: !prevState.readyToDrive
    }));
    localStorage.retrieveData('@isDrivingNow').then(res => {
      if (res) {
        Alert('You must deliver the items to turn it off', '', () => console.log('ok'), () => console.log('cancel'))
      }
      else {
        this.isReadyToDrive(this.state.readyToDrive);
        if (this.state.readyToDrive) {
          this.setState({ checkOrder: true, isOpen: false })
          this.setState({ checkOrder: false })
        }

      }
    }).catch(err => {
      console.log(err);
    })
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
  onLongPressTitle() {
    nextTrip().then(isAccepted => {
      if (isAccepted) {
        this.setState({ nextTripAccepted: isAccepted })
        this.setState({ nextTripAccepted: null, isOpen: false })
      }
    }).catch(err => console.log(err));
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
            onPressTitle={() => console.log('title pressed')}
            onPressRight={() => this.isReadyToDrive2()}
            onPressLeft={() => this.setState({ isOpen: true })}
            onLongPressTitle={() => this.onLongPressTitle()}
          />

          <Notification
            readyToDrive={this.state.checkOrder}
            nextTripAccepted={this.state.nextTripAccepted}
            testFun={(x) => {
              let redColor = '#E74C3C';
              if (x === "red" && this.state.rightIconColor !== redColor) {
                this.setState({ rightIconColor: redColor, readyToDrive: false })
              }
            }}
          />


          <ActionButton />
          <Verify />
        </Container>
      </SideMenu>

    );
  }
}


export default HomePage
