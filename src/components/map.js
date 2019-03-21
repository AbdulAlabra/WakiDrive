import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Container } from 'native-base';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import { directions } from './Directions';
import Notification from "./notifications/notification"
import localStorage from './localStorage'


class Map extends Component {
    // state = {
    //     coordinates: []
    // }
    componentDidUpdate() {
        if (this.props.cords.length > 0) { 

            this.map.fitToCoordinates(this.props.cords, { edgePadding: { top: 80, right: 80, bottom: 80, left: 80 }, animated: true });
        }

    }

    render() {

        let marker = null;
        if (this.props.cords.length > 0) {
            marker = <Marker coordinate={this.props.cords[this.props.cords.length - 1]} title='Store' />
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
                    cords={this.props.cords}
                    showsTraffic={true}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    scrollEnabled={true}
                    followsUserLocation={true}
                    region={this.props.region}
                >
                    {/* <Notification>
                    </Notification>  */}
                    <Polyline
                        coordinates={this.props.cords}
                        strokeWidth={5}
                        strokeColor="green"

                    />
                    {marker}
                    {this.props.children}
                    {/* {test()} */}

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
