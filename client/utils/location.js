import node_geocoder from "node-geocoder";
import axios from "axios"

// const geoCoder = node_geocoder({
//     provider : "opencage",
//     apiKey : process.env.opencage_location_api_key
// })

export const getLocation = async (latitude, longitude)=>{
    try {
        // const geoData = await geoCoder.reverse({lat : latitude , lon : longitude})
        // return geoData        
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`,{
            params : {
                key : process.env.opencage_location_api_key,
                q : `${latitude},${longitude}`,
                // pretty : 1,
                // no_annotations : 1
            }
        })
        const result = response.data.results
        const location = {
            latitude : result[0].geometry.lat || null,
            longitude : result[0].geometry.lng || null,
            pinCode : result[0].components.postcode || null,
            street : result[0].components.road || "",
            streetType : result[0].components.road_type || "",
            city : result[0].components.city || "",
            state : result[0].components.state || "",
            district : result[0].components.state_district || "",
            country : result[0].components.country || "",
        }
        return location
    } catch (error) {
        console.log("location util m h error", error)        
        next(error)
    }
}