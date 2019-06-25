import { distance } from "./Directions"

var y = 0;
const dictanceLink = async (DriverURL, stores) => {  
        let x = 0;
        let makeURL = stores.reduce((prevURL, nextURL) => {
            x++
            let lat = nextURL.location.latitude
            let lang = nextURL.location.longitude
            let thisStoreURL = `${lat},${lang}`
            if (x !== stores.length) {
                thisStoreURL += "|";
            }
            return prevURL + thisStoreURL
        }, "");
      
        
       return distance(DriverURL, makeURL)
}

export default dictanceLink;