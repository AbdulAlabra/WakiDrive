import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Container } from 'native-base';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';



const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
var LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;



class Map extends Component {
    state = {
        region: null
    }
    // componentWillMount() {
    //     this.watchUserLocation()
    // }
    // componentDidMount() {
    //     this.setState({ region: null })

    // }
    componentDidUpdate() {
        if (this.props.cords.length > 0) {

            this.map.fitToCoordinates(this.props.cords, { edgePadding: { top: 80, right: 80, bottom: 80, left: 80 }, animated: true });
        }

    }
    watchUserLocation() {
        navigator.geolocation.getCurrentPosition(position => {
            this.setState({
                region: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                }
            });
        }, err => console.log(err));
    }


    render() {
        let marker = null;
        let polyline = null;
        if (this.props.cords.length > 0) {
            marker = <Marker coordinate={this.props.cords[this.props.cords.length - 1]} title='Store' />
            polyline = <Polyline coordinates={this.props.cords} strokeWidth={5} strokeColor="green" />

        }

        return (
            <Container>
                <MapView
                    ref={map => {
                        this.map = map;
                    }}

                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={{
                        latitude: 38.616908699999996,
                        longitude: -121.33323580000001,
                        latitudeDelta: 0.1622,
                        longitudeDelta: 0.1421,
                    }}
                    showsTraffic={true}
                    showsUserLocation={true}
                    // showsMyLocationButton={true}
                    scrollEnabled={true}
                    followsUserLocation={true}
                    region={this.state.region}
                >
                    {polyline}
                    {marker}
                    {this.props.children}
                </MapView>
            </Container>


        );
    }
}




export default Map

const styles = StyleSheet.create({
    mapContainer: {
        width: '100%',
        flex: 1

    },
    map: {
        width: '100%',
        height: '100%'
    }
});
