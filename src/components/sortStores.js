import { distance } from "./Directions"

var y = 0;
const dictanceLink = async (DriverURL, stores) => {
    y++
    if (y === 3) {
        
        let x = 0;
        let makeURL = stores.reduce((prevURL, nextURL) => {
            x++
            let lat = nextURL.storeLocation.latitude
            let lang = nextURL.storeLocation.longitude
            let thisStoreURL = `${lat},${lang}`
            if (x !== stores.length) {
                thisStoreURL += "|";
            }
            return prevURL + thisStoreURL
        }, "");
        // console.log(DriverURL);
        // console.log(makeURL);
        // console.log(stores);
        
       return distance(DriverURL, makeURL)
    }
    else {
        return false;
    }
}

export default dictanceLink;