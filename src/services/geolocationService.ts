import axios from "axios";

import config from "../config/config";

export const geolocationByPostalCode = postalCode => {
  const { bingMapsKey } = config;
  const pointPromisse = new Promise((resolve, reject) => {
    const url = `http://dev.virtualearth.net/REST/v1/Locations/BR/${postalCode}?key=${bingMapsKey}`;
    axios
      .get(url)
      .then(function(response) {
        const point = response.data.resourceSets[0].resources[0].point;
        resolve(point);
      })
      .catch(function(error) {
        reject(error);
      });
  });
  return pointPromisse;
};
