import node_geocoder from "node-geocoder";
import axios from "axios";

// const geoCoder = node_geocoder({
//     provider : "opencage",
//     apiKey : process.env.opencage_location_api_key
// })

//! get Location from latitude and longitude

export const getLocation = async (latitude, longitude, pinCode) => {
  try {
    // const geoData = await geoCoder.reverse({lat : latitude , lon : longitude})
    // return geoData
    let response;
    if (latitude && longitude) {
      response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json`,
        {
          params: {
            key: process.env.opencage_location_api_key,
            q: `${latitude},${longitude}`,
            // pretty : 1,
            // no_annotations : 1
          },
        }
      );
    } else if (pinCode) {
      if (pinCode.toString().length < 2) {
        return "no address found for this pin code";
      }
      response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json`,
        {
          params: {
            key: process.env.opencage_location_api_key,
            q: pinCode,
            countrycode: "in",
          },
        }
      );
      if (response.data.results[0]?.components.postcode != pinCode)
        return `no address found for this pin code`;
    }

    const result = response.data.results;
    if (!result[0]?.components || result.length == 0) {
      return `no address found`;
    }

    const location = {
      latitude: result[0].geometry.lat || null,
      longitude: result[0].geometry.lng || null,
      pinCode: result[0].components.postcode || null,
      street: result[0].components.road || "",
      streetType: result[0].components.road_type || "",
      city: result[0].components.city || "",
      state: result[0].components.state || "",
      district: result[0].components.state_district || "",
      country: result[0].components.country || "",
      mapLink: `https://www.google.com/maps?q=${result[0].geometry.lat},${result[0].geometry.lng}`,
    };
    return location;
  } catch (error) {
    console.log("location util m h error", error);
    throw error;
  }
};
