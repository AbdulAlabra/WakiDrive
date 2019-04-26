import geolib from 'geolib'
import Polyline from '@mapbox/polyline'

var x = 0

const steps = async (step, driverLocation) => {

    let stepPoints = step.polyline.points
    let points = Polyline.decode(stepPoints);
    let start_location = {
        latitude: step.start_location.lat,
        longitude: step.start_location.lng
    }
    let end_location = {
        latitude: step.end_location.lat,
        longitude: step.end_location.lng
    }
    let cords = points.map(point => {
        return { latitude: point[0], longitude: point[1] }
    });
    let stepDeatils = {
        cords,
        start_location,
        end_location,
        driverLocation
    }

    return isDriverOnPolyLine(stepDeatils)
}

const isDriverOnPolyLine = async (step) => {
    let cords = step.cords

    let start_location = step.start_location
    let end_location = step.end_location

    let driverLocation = step.driverLocation

    let IsStepEnded = geolib.isPointInCircle(driverLocation, end_location, 50)
    let isStepStarted = geolib.isPointInCircle(driverLocation, start_location, 100)

    if (IsStepEnded) {
        return "step completed";
    }
    else if (isStepStarted) {
        return "step started";
    }
    else {
        let closestPoint = geolib.findNearest(driverLocation, cords)
        // console.log(cords.length);
        // let compassDirection = geolib.getCompassDirection(driverLocation, end_location); // from 
        // console.log("__________________________")
        // console.log(`E: ${compassDirection.exact} / R: ${compassDirection.exact} .. actual`);

        // let backCampass = geolib.getCompassDirection(start_location, driverLocation);
        // console.log(`E: ${backCampass.exact} / R: ${backCampass.exact} .. back`);
        // console.log("__________________________")  // to 

        if (closestPoint.distance >= 50) {
            return "redirect"
        }
        else {
            return "on track"
        }
    }
}



export default steps