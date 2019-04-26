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
var LATITUDE_DELTA = 0.01; // horizental
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


class Map extends Component {

    state = {
        overview: false,
        swipe: false,
        initialRegion: null,
        location: null,
        buttonStatus: "black",
        shouldShowButton: false,
        redirect: false,
        toLocation: undefined,
        polylineCords: undefined,
        steps: [],
        compass: undefined,
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
        if (this.props.cords.length > 0 && !this.state.overview) {
            this.map.fitToCoordinates(this.props.cords, { edgePadding: { top: 80, right: 80, bottom: 80, left: 80 }, animated: true });


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
            let compass = geolib.getCompassDirection(stepStartLocation, stepEndLocation)
            console.log("Compass")
            // this is where the driver should head to ...
            console.log(compass);
            console.log("Compass")

            this.setState({
                overview: true,
                steps: this.props.step,
                stepEndLocation,
                storeLocation,
                stepStartLocation,
                compass,
                redirect: false
            });
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
            if (isInitialRegion) {
                this.setState({ initialRegion: region, location })
            }
            else {
                this.map.animateToNavigation(region, 0, 20, 500)

                this.setState({ shouldShowButton: false, swipe: false, location })
                if (this.state.stepStatus === "redirect") {
                    directions(location, this.state.storeLocation)
                        .then(res => {
                            console.log(res);
                        }).catch(err => {
                            console.log(err);
                        })
                }
            }
        }, err => console.log(err))
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
    cordsCheck() {
        fromToCords(this.state.steps[0].polyline.points)
            .then(polylineCords => {
                console.log(polylineCords)
                this.setState({ polylineCords });
            })
            .catch(err => {
                console.log(err)
            })
    }
    driverView(location) {
        const { polylineCords, toLocation, stepStatus, buttonStatus } = this.state
        let driverLocation = location.driverLocation

        if (polylineCords !== undefined) {
            if (toLocation === undefined) {
                let findPoint = polylineCords.find(point => {
                    let center = geolib.getCenter([point.from, point.to])
                    let driverPoint = geolib.isPointInCircle(driverLocation, center, point.distance / 2)
                    return driverPoint === true
                });
                if (findPoint === undefined) {

                    // let allCords = polylineCords.map(point => {
                    //     return point.from
                    // })
                    // let findNearest = geolib.findNearest(driverLocation, allCords)
                    // let closestPoint = polylineCords[Number(findNearest.key)];
                    // console.log(findNearest);
                    // console.log(closestPoint);
                    // let compassTo = geolib.getCompassDirection(driverLocation, closestPoint.to)
                    // let compassFrom = geolib.getCompassDirection(closestPoint.from, driverLocation)
                    // console.log("compassFrom")
                    // console.log(compassFrom)
                    // console.log("compassTo")
                    // console.log(compassTo)
                    if (stepStatus !== "redirect") {
                        this.setState({
                            stepStatus: "redirect",
                            shouldShowButton: true,
                            buttonStatus: "red"
                        });
                    }
                    // we have to check if user is missed the route
                } else {

                    console.log("!!!!!!!!!New point assigned!!!!!!!!")
                    let bearing = geolib.getBearing(findPoint.from, findPoint.to)
                    console.log(findPoint.indexNumber);
                    this.map.animateToNavigation(location.region, bearing, 90, 0.1)
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
                    this.map.animateToNavigation(location.region, bearing, 90, 0.1)
                    if (isDriverInFromPoint) {
                        console.log("driver is in FROM cirlce")
                        if (buttonStatus !== "green") {
                            this.setState({ buttonStatus: "green" })
                        }
                    }
                    else if (isDriverInToPoint) {
                        console.log("driver is in TOO cirlce")
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
                    this.map.animateToNavigation(location.region, bearing, 90, 0.1)
                    console.log("Point is Done !!!!!!!")
                    console.log("_______________\n");
                    // polylineCords.splice(0, toLocation.indexNumber + 1);
                    this.setState({ toLocation: undefined })
                }

            }

            // let cords = polylineCords.map(point => {
            //     return point.from
            // });
        }
    }
    isStepDone(res, location) {
        const { steps, stepStatus, stepEndLocation } = this.state
        if (res === "step started") {
            if (stepStatus !== "step started") {
                this.messege("I started")
                this.cordsCheck()
                this.setState({ stepStatus: "step started" })
            }
        }
        else if (res === "step completed") {
            if (steps.length === 1) {
                if (stepStatus !== "allDone") {
                    // this.messege("all Done", "No more steps")
                    // console.log("completed run")
                    // console.log(res)
                    this.setState({
                        stepStatus: "allDone",
                        steps: [],
                        stepEndLocation: undefined,
                        stepStartLocation: undefined,
                        storeLocation: undefined,
                        overview: false
                    })
                }
            }
            else {
                if (stepStatus !== "step completed" && steps.length >= 1) {
                    // this.messege("I completed")
                    let updatedSteps = steps
                    updatedSteps.shift()
                    let newStepStartLocation = stepEndLocation
                    let newStepEndLocation = {
                        latitude: updatedSteps[0].end_location.lat,
                        longitude: updatedSteps[0].end_location.lng
                    }
                    let compass = geolib.getCompassDirection(newStepStartLocation, newStepEndLocation)
                    //how to redirect accuratly
                    console.log("New compass");
                    console.log(compass);
                    console.log("New compass");
                    this.setState({
                        steps: updatedSteps,
                        stepStatus: res,
                        stepEndLocation: newStepEndLocation,
                        stepStartLocation: newStepEndLocation,
                        compass
                    });
                }
            }
        }
        // else if (res === "redirect") {
        //     // console.log("redirect")
        //     // redirect re route again
        //     if (stepStatus !== "redirect") {
        //         // this.messege("I redirect")
        //         this.setState({ stepStatus: "redirect" })
        //     }
        // }
        // else if (res === "on track") {
        //     // console.log("on track")
        //     // let bearing = geolib.getBearing(location.driverLocation, stepEndLocation)
        //     // this.map.animateToNavigation(location.region, bearing, 60, 0.1)
        //     if (stepStatus !== "on track") {
        //         // this.messege("on track")
        //         this.setState({ stepStatus: "on track" })

        //     }
        // }
    }
    render() {
        const { shouldShowButton } = this.state
        let marker = null;
        let polyline = null;
        let locationButton = null;

        if (this.props.cords.length > 0) {
            marker = <Marker coordinate={this.props.cords[this.props.cords.length - 1]} title='Store' />
            polyline = <Polyline coordinates={this.props.cords} strokeWidth={10} strokeColor="#1EADFF" />
        }
        if (shouldShowButton) {
            locationButton = <RoundedButton
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
                        const { shouldShowButton, steps, stepEndLocation } = this.state
                        if (!shouldShowButton && steps.length > 0) {
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
                            if (this.state.steps.length > 0) {

                                if (stepEndLocation !== undefined) {

                                    stepChecker(this.state.steps[0], driverLocation)
                                        .then(res => {
                                            let locationInfo = { region, driverLocation }
                                            this.isStepDone(res, locationInfo)
                                            this.driverView(locationInfo)
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        })
                                }
                            }
                        }
                    }}
                    step={this.props.step}
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


                {locationButton}
                <RoundedButton
                    backgroundColor={this.state.buttonStatus}
                    position="left"
                />
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
