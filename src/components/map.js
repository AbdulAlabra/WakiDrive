import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Container } from 'native-base';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import { directions } from './Directions';



class Map extends Component {
    state = {
        coordinates: []
    }
    componentDidMount() {

        navigator.geolocation.getCurrentPosition(location => {
            let latitude = location.coords.latitude;
            let longitude = location.coords.longitude;
            let origin = { latitude: latitude, longitude: longitude }
            let destination = { latitude: 38.648002, longitude: -121.31038 }
            directions(origin, destination).then(cords => {
                // console.log(cords)
                this.setState({ coordinates: cords })
                this.map.fitToCoordinates(cords, { edgePadding: { top: 80, right: 80, bottom: 80, left: 80 }, animated: true });
            }).catch(err => console.log(err));
        }, err => console.log(err));

    }

    render() {
        let marker = null;
        if (this.state.coordinates.length > 0) {
            marker = <Marker coordinate={this.state.coordinates[this.state.coordinates.length - 1]} title='Store' />
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
                    showsMyLocationButton={true}
                    scrollEnabled={true}
                    followsUserLocation={true}
                    region={this.props.region}
                >
                    <Polyline
                        coordinates={this.state.coordinates}
                        strokeWidth={5}
                        strokeColor="green"

                    />
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
