import React, { Component } from 'react';
import { Container } from 'native-base';
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
class HomePage extends Component {
  static navigationOptions = {
    header: null
  }
  state = {
    drivingView: false,
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
    checkOrder: false,
    duration: 0
  }
  
  wasDriverReadyToDrive() {
    localStorage.retrieveData('@isReadyToDrive')
      .then(res => {
        if (res) {
          //this means the driver was on ReadyToDrive State
          this.setState({ rightIconColor: '#58D68D', readyToDrive: res })
          this.setState({ checkOrder: false })

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
  componentDidMount() {
    permission()
  }
  componentWillMount() {
    this.wasDriverReadyToDrive()
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
          this.setState({ checkOrder: true })
          this.setState({ checkOrder: false })
        }

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
  testProps(title) {
    console.log(title);
    // if(title) {
    //   this.setState({ title })
    // }
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
