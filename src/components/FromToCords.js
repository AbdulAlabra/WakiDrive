

import Polyline from '@mapbox/polyline'
import geolib from 'geolib'

const FromToCords = async (polylineCode) => {
    let points = Polyline.decode(polylineCode);
    let cords = points.map(point => {
        return { latitude: point[0], longitude: point[1] }
    });
    const fromToPoints = cords.reduce((newArray, from) => {
        let toIndex = cords.indexOf(from) + 1
        if (toIndex !== cords.length) {
            let to = cords[toIndex]
            let distance = geolib.getDistance(from, to)
            let compass = geolib.getCompassDirection(from, to)
            newArray.push({ to, from, distance, compass, indexNumber: toIndex - 1 });
            return newArray
        }
        else {
            return newArray
        }
    }, [])
    return fromToPoints
}
export default FromToCords