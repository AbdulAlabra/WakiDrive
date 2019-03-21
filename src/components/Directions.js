import PolyLine from '@mapbox/polyline'
import Config from 'react-native-config'


const APIkey = Config.GOOGLE_KEY;

export const distance = (origin, destination) => {
    const value = fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${APIkey}`)
        .then(res => {
            return res.json().then(result => {
                const originAddresses = result.origin_addresses[0];
                const destinationAddresses = result.destination_addresses;
                const journey = result.rows[0].elements;
                const returnTotalTime = journey.reduce((x, thisjourney) => {
                    thisjourney.address = destinationAddresses[x];
                    thisjourney.storeKey = x;
                    return x + 1
                }, 0);

                journey.sort((a, b) => a.duration.value - b.duration.value);

                const getStoresKey = journey.map(store => {
                    return store.storeKey;
                });
                //return journey if you want to get access to more details.
                return getStoresKey;
            });

        }).catch(err => {
            console.log(err);
            return null;
        });


    return value;
}
// let origin = { latitude: 38.580869, longitude: -121.310163 }
// let destination = { latitude: 38.648002, longitude: -121.31038 }

export const directions = (origin, destination) => {
    return fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${APIkey}`)
        .then(res => {
            return res.json().then(result => {
                const overview_polyline = result.routes[0].overview_polyline.points
                const points = PolyLine.decode(overview_polyline);
                const cords = points.map(point => {
                    return { latitude: point[0], longitude: point[1] }
                });

                // console.log(cords);
                return cords;
            });
        }).catch(err => console.log(err));
}


export default directions;







// We may not use these values.. they were in directions function. 

// const addressInfo = result.routes[0].legs[0];
// const distance = addressInfo.distance.text;
// const distanceValue = addressInfo.distance.value;
// const duration = addressInfo.duration.text;
// const durationValue = addressInfo.duration.value;
// console.log(result);
// console.log(distance)
// console.log(distanceValue)
// console.log(duration)
// console.log(durationValue)

// We may not use these values.. they were in directions function. 
