import geolib from "geolib"


const compass = async (origin, destenation) => {
    
    let compassDirection = geolib.getCompassDirection(origin, destenation);
    let bearing = geolib.getBearing(origin , destenation)
    return bearing * -1
}


export default compass