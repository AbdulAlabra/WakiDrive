import React, { Component } from 'react';
import { Container, View } from 'native-base';
import Header from "../components/Header";
import SideMenu from './Menu'
import localStorage from '../components/localStorage'
import permission from '../components/notifications/helpers/permission';
import Notification from '../components/notifications/notification'
import nextTrip from '../components/orders/nextDestination';
import Alert from '../components/Alert'
import isReadyToDrive from '../components/isReadyToDrive'
import ActionButton from "../components/ActionButton/ActionButton"
import Verify from "../components/verifyUserInfo/ShowModal"
import firebase from "../components/Firebase"

class HomePage extends Component {
  static navigationOptions = {
    header: null
  }
  state = {
    readyToDrive: true,
    title: 'WakiDrive',
    nextTripAccepted: undefined,
    isOpen: false,
    rightIconColor: "#99ccff",
    checkOrder: false,
    duration: 0,
    isLoggedIn: undefined,
  }

  wasDriverReadyToDrive() {
    localStorage.retrieveData('@isReadyToDrive')
      .then(res => {
        if (res) {
          this.setState({ rightIconColor: '#58D68D', readyToDrive: res })
        }
        else {
          this.setState({
            rightIconColor: '#E74C3C',
            readyToDrive: res
          });
        }
      })
      .catch(err => console.log(err))
  }

  cancelOrder() {
    let cancel = () => {
      this.setState({ nextTripAccepted: "canceled" })
      this.setState({ nextTripAccepted: null })
      localStorage.storeData("@isDrivingNow", false);
      this.isReadyToDrive2();
    }
    //let therefore = 'Therefore, Please Keep Driving.'
    Alert("WARNING..", `If you click "Cancel Order", you are not going to be paid for this delivery.\nAlso, you may be restricted to drive for some period time.\n\nTherefore, Please Keep Driving.`, () => cancel(), () => console.log('Keep Driving'), "Cancel Order", "Keep Driving");
  }

  componentDidMount() {
    permission()
  }

  componentWillMount() {
    this.wasDriverReadyToDrive()
  }


  isReadyToDrive(x) {
    if (x) {
      this.setState({ rightIconColor: '#58D68D', isOpen: false, checkOrder: true });

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

    this.setState(prevState => ({
      readyToDrive: !prevState.readyToDrive
    }));
    localStorage.retrieveData('@isDrivingNow').then(res => {
      if (res) {
        Alert("You cannot turn this off while driving.", 'You must deliver the items or cancel the order. If you cancel the order, you will not get paid', () => this.cancelOrder(), () => console.log('Keep driving'), "Cancel Order", "Keep Driving");
      }
      else {
        this.isReadyToDrive(this.state.readyToDrive);
      }
    }).catch(err => {
      console.log(err);
    })
  }

  onLongPressTitle() {
    nextTrip().then(isAccepted => {
      if (isAccepted) {
        this.setState({ nextTripAccepted: isAccepted })
        this.setState({ nextTripAccepted: null, isOpen: false })
      }
    }).catch(err => console.log(err));
  }

  showTime(journey) {
    clearInterval(timer)
    let durationText = journey.duration.text
    this.setState({ title: durationText })

    let duration = Math.round(journey.duration.value / 60);

    let interval = () => {
      console.log("I run ")
      let remainningTime = duration - 1
      console.log(remainningTime);
      if (remainningTime === 0 || this.state.nextTripAccepted) {
        console.log("STop")
        clearInterval(timer)
      }
      else {
        duration = remainningTime
        this.setState({ title: remainningTime + " mins" })
      }
    }

    let timer = setInterval(interval, 5000)
  }

  render() {

    return (
      <SideMenu isOpen={this.state.isOpen}>
        <Container>
          <Header
            title={this.state.title}
            rightIconName="car"
            rightIconColor={this.state.rightIconColor}
            iconSize={30}
            onLongPressRight={() => console.log('right long press')}
            onPressTitle={() => console.log("title")}
            onPressRight={() => this.isReadyToDrive2()}
            onPressLeft={() => this.setState({ isOpen: true })}
            onLongPressTitle={() => this.onLongPressTitle()}
          />

          <Notification
            readyToDrive={this.state.checkOrder}
            nextTripAccepted={this.state.nextTripAccepted}
            checkOrder={(isNewOrder) => {
              this.setState({ checkOrder: isNewOrder });
              console.log("Hello check order");
            }}
            delivered={(x) => {
              let redColor = '#E74C3C';
              if (x === "red") {
                this.setState({ rightIconColor: redColor, readyToDrive: false })
              }
            }}
          />
          <ActionButton
            onLongPress={() => console.log("WHASSSSSAAAAPPP")}
          />

          <Verify />

        </Container>
      </SideMenu>

    );
  }
}


export default HomePage
