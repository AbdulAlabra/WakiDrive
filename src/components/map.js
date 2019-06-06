import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Container, View } from 'native-base';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline, Circle } from 'react-native-maps';
import Alert from "./Alert"
import geolib from "geolib"
import stepChecker from "./RedirectUserLocation"
import { directions } from './Directions';
import RoundedButton from "./RoundedButton"
import fromToCords from "./FromToCords"


const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
var LATITUDE_DELTA = 0.002; // horizental
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


class Map extends Component {

    state = {
        swipe: false,
        initialRegion: null,
        location: null,
        buttonStatus: "black",
        shouldShowButton: false,


        toLocation: undefined,
        polylineCords: undefined,
        steps: [],
        cords: [],
        stepStatus: undefined,
        stepEndLocation: undefined,
        stepStartLocation: undefined,
        storeLocation: undefined
    }
    componentWillMount() {
        this.getLocation(true)
    }

    messege(title, body) {
        Alert(title, body || "", () => console.log("yes"), () => console.log("camcel"))
    }
    componentDidUpdate() {
        if (this.props.newRoute === true) {

            this.initializeNewStep()
            if (this.state.stepStatus !== "redirect") {
                this.map.fitToCoordinates(this.props.cords, { edgePadding: { top: 80, right: 80, bottom: 80, left: 80 }, animated: true });

            }
        }
    }

    getLocation(isInitialRegion) {
        navigator.geolocation.getCurrentPosition(position => {
            let region = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }
            let location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            }
            console.log(location)
            if (isInitialRegion) {
                this.setState({ initialRegion: region, location })
            }
            else {
                this.map.animateToNavigation(region, 0, 90, 1000)
                this.setState({ shouldShowButton: false, swipe: false, location })
                if (this.state.stepStatus === "redirect") {
                    this.props.Reroute()
                }
            }
        }, err => console.log(err), { maximumAge: 0, enableHighAccuracy: true })
    }

    onRegionChange(region) {
        const { swipe, location, shouldShowButton, steps } = this.state
        if (swipe) {
            let regionLocation = {
                latitude: region.latitude,
                longitude: region.longitude
            }
            let distance = geolib.getDistance(location, regionLocation) * 0.001;
            if (distance >= 1 || steps.length > 0) {
                if (!shouldShowButton) {
                    this.setState({ shouldShowButton: true });
                }
            }
        }
    }
    cordsCheck(polylinePoints) {
        fromToCords(polylinePoints)
            .then(polylineCords => {
                this.setState({ polylineCords });
            })
            .catch(err => {
                console.log(err)
            })
    }


    driverView(location) {
        const { polylineCords, toLocation, stepStatus, buttonStatus, swipe } = this.state
        let driverLocation = location.driverLocation

        if (polylineCords !== undefined) {


            if (toLocation === undefined) {
                console.log("1")
                let findPoint = polylineCords.find(point => {
                    let center = geolib.getCenter([point.from, point.to])
                    let driverPoint = geolib.isPointInCircle(driverLocation, center, point.distance / 2)
                    return driverPoint === true
                });
                if (findPoint === undefined) {
                    console.log("2")
                    stepChecker(this.state.steps[0], driverLocation)
                        .then(res => {
                            if (res === "redirect" && stepStatus !== "redirect") {
                                console.log("REEEEESSSSS : " + res)
                                this.setState({
                                    stepStatus: "redirect",
                                    shouldShowButton: true,
                                    buttonStatus: "red"
                                });
                            }
                            else if (res === "on track" && stepStatus !== "on track") {
                                if (swipe) {
                                    this.setState({ stepStatus: "on track" })

                                }
                                else {
                                    this.setState({ stepStatus: "on track", shouldShowButton: false })
                                }
                            }
                        }).catch(err => {
                            console.log(err)
                            return false
                        })

                } else {
                    console.log("3")
                    let bearing = geolib.getBearing(findPoint.from, findPoint.to)
                    this.map.animateToNavigation(location.region, bearing, 90, 1000)
                    this.setState({ toLocation: findPoint, stepStatus: "on track" });
                }
            }
            else {
                let center = geolib.getCenter([toLocation.from, toLocation.to])
                let fromCenter = geolib.getCenter([toLocation.from, center])
                let toCenter = geolib.getCenter([toLocation.to, center]);

                let isDriverInPoint = geolib.isPointInCircle(driverLocation, center, toLocation.distance / 2)
                let isDriverInFromPoint = geolib.isPointInCircle(driverLocation, fromCenter, toLocation.distance / 4)
                let isDriverInToPoint = geolib.isPointInCircle(driverLocation, toCenter, toLocation.distance / 4)

                let bearing = geolib.getBearing(toLocation.from, toLocation.to)
                if (isDriverInPoint) {
                    this.map.animateToNavigation(location.region, bearing, 90, 1000)
                    if (isDriverInFromPoint) {
                        // console.log("driver is in FROM cirlce")
                        if (buttonStatus !== "green") {
                            this.setState({ buttonStatus: "green" })
                        }
                    }
                    else if (isDriverInToPoint) {
                        // console.log("driver is in TOO cirlce")
                        if (buttonStatus !== "blue") {
                            this.setState({ buttonStatus: "blue" })
                        }
                    }
                    else {
                        console.log("something wrong")
                        this.setState({ toLocation: undefined })
                    }
                }
                else {
                    // done from this 
                    console.log("4")
                    this.map.animateToNavigation(location.region, bearing, 90, 1000)
                    this.setState({ toLocation: undefined })
                }

            }

        }
    }


    isStepDone(res) {

        const { steps, stepStatus, stepEndLocation, swipe } = this.state

        if (res === "step started") {
            if (stepStatus !== "step started") {
                console.log("started !!!!!!!")

                if (swipe) {
                    this.setState({ stepStatus: "step started" })

                }
                else {
                    this.setState({ stepStatus: "step started", shouldShowButton: false })
                }
            }
        }

        else if (res === "step completed") {
            if (steps.length === 1) {
                if (stepStatus !== "allDone") {
                    this.messege("Arrived")
                    this.setState({
                        stepStatus: undefined,
                        steps: [],
                        cords: [],
                        polylineCords: undefined,
                        stepEndLocation: undefined,
                        stepStartLocation: undefined,
                        storeLocation: undefined,
                        toLocation: undefined,
                    })
                }
            }
            else {
                if (stepStatus !== "step completed" && steps.length >= 1) {
                    let updatedSteps = steps
                    updatedSteps.shift()
                    let newStepStartLocation = stepEndLocation
                    let newStepEndLocation = {
                        latitude: updatedSteps[0].end_location.lat,
                        longitude: updatedSteps[0].end_location.lng
                    }
                    let cordsCheckPolyLine = updatedSteps[0].polyline.points
                    this.cordsCheck(cordsCheckPolyLine)


                    this.setState({
                        steps: updatedSteps,
                        stepStatus: res,
                        stepEndLocation: newStepEndLocation,
                        stepStartLocation: newStepEndLocation,
                    });
                }
            }
        }

    }


    initializeNewStep() {

        let stepEndLocation = {
            latitude: this.props.step[0].end_location.lat,
            longitude: this.props.step[0].end_location.lng
        }
        let stepStartLocation = {
            latitude: this.props.step[0].start_location.lat,
            longitude: this.props.step[0].start_location.lng
        }
        let storeLocation = {
            latitude: this.props.step[this.props.step.length - 1].end_location.lat,
            longitude: this.props.step[this.props.step.length - 1].end_location.lng
        }
        let cordsCheckPolyLine = this.props.step[0].polyline.points

        this.setState({
            steps: this.props.step,
            stepEndLocation,
            storeLocation,
            stepStartLocation,
            cords: this.props.cords,
            stepStatus: undefined
        });
        this.props.routeIsAdded()
        this.cordsCheck(cordsCheckPolyLine)
    }

    render() {
        const { shouldShowButton } = this.state
        let marker = null;
        let polyline = null;
        let locationButton = null;
        let redirectPolyLine = null;

        if (this.state.cords.length > 0) {
            marker = <Marker coordinate={this.state.cords[this.state.cords.length - 1]} title='Store' />
            polyline = <Polyline coordinates={this.state.cords} strokeWidth={20} strokeColor="#1EADFF" />
        }
        if (shouldShowButton) {
            locationButton = <RoundedButton
                position="right"
                backgroundColor="#3498db"
                onPress={() => this.getLocation()}
            />
        }



        return (
            <Container >
                <MapView
                    ref={map => {
                        this.map = map;
                    }}
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    onStartShouldSetResponder={() => {

                        if (!this.state.swipe) {
                            this.setState({ swipe: true })
                        }
                        return true
                    }}
                    showsCompass={true}
                    onRegionChange={(region) => this.onRegionChange(region)}
                    showsTraffic={true}
                    showsUserLocation={true}
                    followsUserLocation={true}
                    initialRegion={this.state.initialRegion}
                    onUserLocationChange={(location) => {
                        location.persist()

                        const { swipe, steps, stepEndLocation } = this.state
                        if (!swipe && steps.length > 0) {

                            let region = {
                                latitude: location.nativeEvent.coordinate.latitude,
                                longitude: location.nativeEvent.coordinate.longitude,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA
                            }

                            let driverLocation = {
                                latitude: location.nativeEvent.coordinate.latitude,
                                longitude: location.nativeEvent.coordinate.longitude
                            }
                            if (stepEndLocation !== undefined) {

                                stepChecker(this.state.steps[0], driverLocation)
                                    .then(res => {

                                        let locationInfo = { region, driverLocation }
                                        this.isStepDone(res)
                                        this.driverView(locationInfo)
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                            }

                        }
                    }}
                >

                    {polyline}
                    {marker}

                    {this.props.children}

                    {(this.state.steps.length < 0) ? null : this.state.steps.map(step => {
                        let endLocation = {
                            latitude: step.end_location.lat,
                            longitude: step.end_location.lng
                        }
                        return <Marker style={{ backgroundColor: "black" }} coordinate={endLocation} key={endLocation.latitude} title='from' />
                    })}
                    {(this.state.polylineCords === undefined) ? null : this.state.polylineCords.map(point => {
                        let n = this.state.polylineCords.indexOf(point) + 1;
                        let center = geolib.getCenter([point.from, point.to])
                        let fromCenter = geolib.getCenter([point.from, center])
                        let toCenter = geolib.getCenter([point.to, center]);
                        return (
                            <View key={n}>
                                <Circle center={center} radius={point.distance / 2} strokeWidth={5} />
                                <Circle center={fromCenter} radius={point.distance / 4} strokeWidth={1} strokeColor={"green"} />
                                <Circle center={toCenter} radius={point.distance / 4} strokeWidth={1} strokeColor={"blue"} />
                            </View>
                        );
                    })}

                </MapView>


                <RoundedButton
                    backgroundColor={this.state.buttonStatus}
                    position="left"
                />
                {locationButton}
            </Container>

        );
    }
}


export default Map

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%'

    },

    Button: {
        backgroundColor: "red",
        borderRadius: 70 / 2,
        height: 70,
        width: 70,
        justifyContent: "center",
        alignSelf: "center",
        margin: "20%"
    },
    buttonContainer: {
        backgroundColor: "green",
        justifyContent: "flex-end",
        flex: 1
    }

});
