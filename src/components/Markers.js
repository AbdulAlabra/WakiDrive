// import React from 'react';
// import MapViewDirections from 'react-native-maps-directions';
// import directions from './Directions';


// const APIkey = "AIzaSyBwbNNU6HH11FZ-iW4Ca_jQ3gOconhWla4";

// export const DriverStorePolyLine = (markerRecived, driverLocation, storeLocation) => {
   
//     if (markerRecived === false) {
//         directions(Number(driverLocation.latitude), Number(driverLocation.longitude), Number(storeLocation.latitude), Number(storeLocation.longitude) );
//         return (
//             <MapViewDirections
//                 origin={driverLocation}
//                 destination={storeLocation}
//                 apikey={APIkey}
//                 mode='driving'
//                 language='en'
//                 strokeWidth={5}
//                 strokeColor="blue"
//             />
//         );
//     }
//     else {
//         return
//     }
// }

// export const StoreBuyerPolyLine = (markerRecived, storeLocation, buyerLocation) => {
//     if (markerRecived === true) {
//         console.log('helllooo');
//         console.log(storeLocation);
//         console.log(buyerLocation);
//         directions( Number(storeLocation.latitude), Number(storeLocation.longitude), Number(buyerLocation.latitude), Number(buyerLocation.longitude) );
//         return (
//             <MapViewDirections
//                 origin={storeLocation}
//                 destination={buyerLocation}
//                 apikey={APIkey}
//                 mode='driving'
//                 language='en'
//                 strokeWidth={5}
//                 strokeColor="green"
//             />
//         );
//     }
//     else {
//         return
//     }
// }
