import React, { Component } from 'react'
import { View, Text, Input, Label, Button, Item, Title } from 'native-base'
import { StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import firebase from '../Firebase'
import localStorage from '../localStorage'
import golib from "geolib"
import Modal from "../ActionButton/Modal"
import Config from 'react-native-config'
import MapView, { PROVIDER_GOOGLE, Marker, } from 'react-native-maps';
import RoundedButton from '../RoundedButton'
////badge-check
import Alert from '../Alert'

const APIkey = Config.GOOGLE_KEY;
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
var LATITUDE_DELTA = 0.01; // horizental
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
class Address extends Component {

    state = {
        city: null,
        state: null,
        country: null,
        postalCode: null,
        address: null,
        Building: null,
        Neighborhood: null,
        street: null,

        isModalVisible: false,
        userInput: "",
        userLocation: null,
        searchQuery: "",
        spacePessed: 0,
        token: "",
        wrongAddress: false,
        predictions: [],
        chosenLocation: undefined,
        showNewAddress: false,
        showForm: false
    }
    _toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });
    componentWillMount() {
        // Un comment this for production
        localStorage.retrieveData("@driverID")
            .then(driverID => {
                if (driverID) {

                    this.setState({ isModalVisible: true })
                    navigator.geolocation.getCurrentPosition(location => {

                        let userLocation = {
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude
                        }
                        this.createToken(userLocation)

                    }, (err) => {
                        console.log(err)
                    }, { maximumAge: 0, enableHighAccuracy:true })
                }
                else {
                    return
                }
            })
    }

    createToken(userLocation) {

        let dummyToken = "dkus38892dkjsuf4hkee0977564hs9889hgahgfjsgf83oyepsjctrewosmcnz9878er4j25h1j3s33hskla47348592f89xxvvss4er89er89aaaer8934jh34hj4389df89df98df98erjkerjker"
        let splitToken = dummyToken.split("");
        let token = ""
        for (var i = 0; i < 20; i++) {

            let item = splitToken[Math.floor(Math.random() * splitToken.length)];
            token = token + item
        }
        this.setState({ token, userLocation })
    }

    fetchAddress(createQuery) {
        const { userLocation, token } = this.state

        if (userLocation) {
            fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${createQuery}&language=ar&types=(regions)&location=${userLocation.latitude},${userLocation.longitude}&key=${APIkey}&sessiontoken=${token}`)
                .then(res => {
                    res.json()
                        .then(address => {
                            if (address.status !== "OK") {
                                this.setState({ wrongAddress: " : Not Found" })
                            }
                            else {

                                let predictions = address.predictions
                                this.setState({ predictions, wrongAddress: "", showNewAddress: true })
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
    async checkSpaces(text) {
        let textSplit = text.split("")
        let lastLetter = textSplit[textSplit.length - 1]
        let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let findNumber = numbers.find(num => {
            return num === Number(lastLetter)
        })
        if (lastLetter === " ") {
            console.log("no space ")
            return false
        }
        else if (findNumber === undefined) {
            console.log("Only numbers")
            return false

        }
        else {
            return true
        }
    }
    saveAddress() {
        const { city, street, postalCode, Building, Neighborhood, address } = this.state
        localStorage.retrieveData("@driverID")
            .then(driverID => {
                // change this line in production
                firebase.database().ref(`drivers/registeredDrivers/${driverID}/driverInfo/address`).update({
                    city,
                    street,
                    postalCode,
                    Building,
                    address,
                    Neighborhood
                })
                    .then(res => {
                        console.log(res)
                        this.done();
                    })
                    .catch(err => {
                        console.log(err);
                    })

            })
            .catch(err => {
                console.log(err)
            })
    }
    done() {
        localStorage.storeData("@addressVerified", true)
            .then(res => {
                if (res) {
                    Alert(
                        "Done", "You are all set!",
                        () => {
                            this.setState({ isModalVisible: false })
                            this.props.onComplete()
                        },
                        () => {
                            this.setState({ isModalVisible: false })
                            this.props.onComplete()
                        }
                    )
                }
                else {
                    Alert(
                        "Something went wrong", "Try Again Later",
                        () => console.log("ok"),
                        () => console.log('cancel')
                    )
                }
            })
            .catch(err => {
                console.log(err)
            })

    }
    validateForm() {
        const { Neighborhood, city, postalCode, Building, street } = this.state
        let checkLength = (text) => {
            if (text !== null) {
                let textSplit = text.trim().split("")
                if (textSplit.length < 4) {
                    console.log(text + " is short")
                    return false
                }
                else {
                    return true
                }
            }
            else {
                return false
            }
        }
        let alretMessage = (input) => {
            Alert(input + " Field", "is badly formated", () => console.log("ok"), () => console.log("cancel"), "ok", "cancel")
        }
        if (checkLength(city) === false) {
            alretMessage("City")
        }
        else if (checkLength(street) === false) {
            alretMessage("Street")

        }
        else if (checkLength(postalCode) === false) {
            alretMessage("Postal Code")

        }
        else if (checkLength(Building) === false) {
            alretMessage("Building Number")

        }
        else if (checkLength(Neighborhood) === false) {
            alretMessage("Neighborhood")
        }
        else {
            this.saveAddress()
        }
    }
    render() {
        const { userInput, city, showForm, street, wrongAddress, predictions, Building, Neighborhood, postalCode, address, searchQuery, isModalVisible } = this.state
        let chosenAddressBox = null
        let predictionsForm = predictions.map((address) => {
            return (
                <TouchableOpacity
                    key={address.place_id}
                    onPress={() => {
                        this.setState({ chosenLocation: address.place_id })
                    }}

                >
                    <View style={styles.resultBox}>
                        <Text style={styles.result}>{address.description}</Text>
                    </View>
                </TouchableOpacity>
            )
        })
        let addressForm = <View>
            <Item fixedLabel last>
                <Label>City</Label>
                <Input
                    placeholder="Riyadh"
                    value={city}
                    onChangeText={city => this.setState({ city })}
                />
            </Item>
            <Item fixedLabel last>
                <Label>Street</Label>
                <Input
                    placeholder="King Abdullah Street"
                    value={street}
                    onChangeText={street => this.setState({ street })}
                />
            </Item>
            <Item fixedLabel last>
                <Label>Postal/Zip Code</Label>
                <Input
                    placeholder="12345"
                    value={postalCode}
                    onChangeText={postalCode => {
                        this.setState({ postalCode })
                        // this.checkSpaces(postalCode)
                        //     .then(res => {
                        //         console.log(res)
                        //         console.log(this.state.postalCode)
                        //         if (res === true) {
                        //             this.setState({ postalCode })
                        //         }
                        //         else {
                        //             return
                        //         }

                        //     }).catch(err => {
                        //         console.log(err)
                        //     })
                    }}
                />
            </Item>
            <Item fixedLabel last>
                <Label>Building Number</Label>
                <Input
                    placeholder="1234"
                    value={Building}
                    onChangeText={Building => {
                        this.setState({ Building })
                        // this.checkSpaces(Building)
                        //     .then(res => {
                        //         console.log(res)

                        //         if (res === true) {
                        //         }
                        //         else {
                        //             return
                        //         }
                        //     }).catch(err => {
                        //         console.log(err)
                        //     })
                    }}
                />
            </Item>
            <Item fixedLabel last>
                <Label>Neighborhood</Label>
                <Input
                    placeholder="Al Rabwah District"
                    value={Neighborhood}
                    onChangeText={Neighborhood => this.setState({ Neighborhood })}
                />
            </Item>
            <Button
                block
                style={{ justifyContent: "center", margin: 15, alignSelf: "center" }}
                onPress={() => this.validateForm()}
            >
                <Text>Save</Text>
            </Button>
        </View>
        let addressDetails = (showForm === false) ? predictionsForm : addressForm
        if (address !== null) {
            chosenAddressBox = <TouchableOpacity

                onPress={() => {

                    this.setState({ showForm: true })
                }}>
                <View style={styles.addressBox}>
                    <Title>Click To Contine</Title>
                    <Text style={styles.result}>{address}</Text>
                </View>
            </TouchableOpacity>
        }
        return (
            <Modal color='#9b59b6' toggleModal={this._toggleModal} isModalVisible={isModalVisible} >

                <View style={styles.Container}>
                    <View style={styles.inputContainer}>

                        <Text>Drag or Type Your Address <Text style={{ fontWeight: 'bold' }}>{wrongAddress}</Text></Text>
                        <Item style={styles.input}>
                            <Input
                                placeholder="Search .."
                                value={userInput}
                                onChangeText={(currentInput) => {
                                    let text = currentInput.replace(".", " ").split("")
                                    let query = currentInput.trim().split("")
                                    if (text.length >= 2) {
                                        let lastIndex = text[text.length - 1]
                                        let beforeLastIndex = text[text.length - 2]
                                        if (lastIndex === " " && beforeLastIndex === " ") {
                                            let newString = text.reduce((newInput, oldInput) => {
                                                return newInput + oldInput

                                            }, "");
                                            this.setState({ userInput: newString.trim(), showForm: false })
                                        }
                                        else {

                                            let createQuery = query.reduce((queryToSearch, userInput) => {
                                                if (userInput === " ") {
                                                    return queryToSearch + "+"
                                                } else {
                                                    return queryToSearch + userInput
                                                }
                                            }, "")

                                            if (createQuery === searchQuery) {
                                                console.log("No need for search")
                                            }
                                            else {
                                                this.fetchAddress(createQuery)
                                            }

                                            this.setState({ userInput: currentInput, searchQuery: createQuery, showForm: false })

                                        }
                                    } else {
                                        this.setState({ userInput: currentInput, showForm: false })
                                    }
                                }}
                            />
                        </Item>
                    </View>
                    {chosenAddressBox}
                    <View style={styles.resultContainer}>
                        <ScrollView>
                            {addressDetails}
                        </ScrollView>
                    </View>
                    <Map
                        chosenLocation={this.state.chosenLocation}
                        readyToConfirm={(address) => {
                            this.setState({ address })
                        }}
                    />
                </View>
            </Modal>
        );
    }
};

class Map extends Component {
    state = {
        userLocation: null,
        region: null,
        marker: null,
        locationChosen: {
            id: false,
            region: false,
            locaion: false
        },
        newMarkerisAdded: false,
        choosingPoint: false,
        startToChoose: false
    }
    componentDidUpdate() {
        console.log("I should update")
        if (this.props.chosenLocation !== undefined && this.state.locationChosen.id !== this.props.chosenLocation) {
            fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${this.props.chosenLocation}&key=${APIkey}`)
                .then(res => {
                    res.json()
                        .then(address => {
                            let result = address.result.geometry.location
                            let location = {
                                latitude: result.lat,
                                longitude: result.lng,
                            }
                            let region = {
                                latitude: result.lat,
                                longitude: result.lng,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA
                            }
                            this.setState({
                                marker: location,
                                locationChosen: {
                                    id: this.props.chosenLocation,
                                    region,
                                    location
                                }
                            })

                            this.map.animateToRegion(region, 500)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
                .catch(err => {
                    console.log(err)
                })

        }
    }
    componentWillMount() {

        navigator.geolocation.getCurrentPosition(location => {

            let userLocation = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }
            this.setState({ userLocation })

        }, (err) => {
            console.log(err)
        }, { maximumAge: 0, enableHighAccuracy:true })
    }
    fetchAddress(locaion) {
        return fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${locaion.latitude},${locaion.longitude}&key=${APIkey}`)
            .then(res => {
                return res.json()
                    .then(address => {
                        console.log(address)
                        return address.results[0].formatted_address
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
            })
    }
    Confirm() {
        const { marker, region, userLocation } = this.state
        if (marker !== null) {
            console.log("User marker location")
            this.fetchAddress(marker)
                .then(address => {
                    this.props.readyToConfirm(address)
                })
                .catch(err => {
                    console.log(err)
                })
        }
        else if (region !== null) {
            console.log("use region location")
            this.fetchAddress(region)
                .then(address => {
                    this.props.readyToConfirm(address)
                })
                .catch(err => {
                    console.log(err)
                })

        }
        else if (userLocation !== null) {
            console.log("use user location")
            this.fetchAddress(userLocation)
                .then(address => {
                    this.props.readyToConfirm(address)
                })
                .catch(err => {
                    console.log(err)
                })
        }
        else {
            console.log("you must let us get your locaion")
        }
    }

    render() {


        let marker = null
        if (this.state.userLocation) {
            const userLocation = {
                latitude: this.state.userLocation.latitude,
                longitude: this.state.userLocation.longitude
            }

            let cords = (this.state.region === null) ? userLocation : (this.state.marker !== null) ? this.state.marker : this.state.region
            marker = <Marker
                coordinate={cords}
                draggable
                onDrag={(x) => {
                    this.setState({ startToChoose: true })
                }}
                onDragStart={(x) => {
                    this.setState({ choosingPoint: true })
                }}
                onDragEnd={(x) => {
                    console.log("on drag end")
                    let marker = x.nativeEvent.coordinate
                    this.setState({ marker, newMarkerisAdded: true })
                }}
            />
        }

        return (
            <View style={styles.mapContainer}>
                <MapView
                    ref={map => {
                        this.map = map;
                    }}
                    onRegionChangeComplete={(region) => {
                        console.log(this.state.marker)
                        console.log("Done");
                        if (this.state.userLocation) {
                            if (this.state.newMarkerisAdded === true || this.state.choosingPoint === true || this.state.startToChoose === true) {
                                if (this.state.newMarkerisAdded === true) {
                                    this.setState({ newMarkerisAdded: false, choosingPoint: false, startToChoose: false })
                                }

                            } else {

                                let newRegion = {
                                    latitude: region.latitude,
                                    longitude: region.longitude
                                }
                                let locatioin = (this.state.marker !== null) ? this.state.marker : (this.state.region !== null) ? { latitude: this.state.region.latitude, longitude: this.state.region.longitude } : this.state.userLocation
                                let isInsideCircle = golib.isPointInCircle(locatioin, newRegion, 500)
                                if (!isInsideCircle) {
                                    this.setState({ region, marker: null });
                                }
                            }
                        }
                    }}

                    style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 20,
                    }}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    initialRegion={this.state.userLocation}
                    showsMyLocationButton={true}

                >
                    {marker}
                </MapView>
                <RoundedButton
                    circleSize={40}
                    icon="check"
                    position="center"
                    onPress={() => this.Confirm()}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    Container: {
        flex: 1,
        justifyContent: "center"
    },
    input: {
    },
    inputContainer: {
        marginTop: 100,
        // backgroundColor : "orange",
    },
    resultContainer: {

        flex: 1,
        justifyContent: "space-around",
        borderColor: "black",
        padding: 10,
        // borderBottomWidth: 0.2,
        // borderRightWidth: 0.2,
        // borderLeftWidth: 0.2,
        // borderTopWidth: 0.2,

    },
    mapContainer: {
        flex: 1,
        borderColor: "red",
        padding: 10,
    },
    resultBox: {
        backgroundColor: "#e5ffff",
        flexDirection: "column",
        overflow: "scroll",
        alignItems: "center",
        justifyContent: "space-evenly",
        height: 50,
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        width: "100%",
        borderColor: "black",
        borderBottomWidth: 0.2,
        borderRightWidth: 0.2,
        borderLeftWidth: 0.2,
        borderTopWidth: 0.2,
        borderRadius: 10,

    },
    addressBox: {
        backgroundColor: "#68bbff",
        flexDirection: "column",
        overflow: "scroll",
        alignItems: "center",
        justifyContent: "space-evenly",
        height: 100,
        marginTop: 10,
        marginBottom: 10,
        padding: 5,
        width: "100%",
        borderColor: "black",
        borderBottomWidth: 0.2,
        borderRightWidth: 0.2,
        borderLeftWidth: 0.2,
        borderTopWidth: 0.2,
        borderRadius: 10,
    },
    overlayContainer: {
        flex: 1,
        opacity: 0.5,
        backgroundColor: "black"
    },
    result: {
    },


})
export default Address