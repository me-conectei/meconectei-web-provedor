import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Polygon,
  Marker,
} from "@react-google-maps/api";
import axios from "axios";

const BasicMap = ({ city, coords, setCoords, position, setPosition }) => {
  // eslint-disable-next-line
  const [_nonused, setCenter] = useState({
    lat: -26.3825645832962,
    lng: -48.829166464261704,
  });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyC_o7A8i-8xhsvYvJz9UEk9TagSRZEsvNE",
  });

  const onLoad = (polyline) => {
    console.log("polyline: ", polyline);
  };

  const options = {
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.3,
    clickable: true,
    draggable: true,
    editable: true,
    visible: true,
    radius: 30000,
    zIndex: 1,
    path: coords,
  };

  const cityValue = encodeURI(city);

  const url = `https://api-ieaqui.avamobile.com.br/company/proxy?query=${cityValue}`;

  useEffect(() => {
    axios
      .get(url)
      .then((res) => {
        setPosition({
          lat: res.data.data.results[0].geometry.location.lat,
          lng: res.data.data.results[0].geometry.location.lng,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [city, url, setPosition]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={position}
      zoom={13}
      onClick={(e) => {
        const clickPosition = e.latLng;
        setCoords([
          { lat: clickPosition.lat(), lng: clickPosition.lng() },
          ...coords,
        ]);
        setCenter({ lat: clickPosition.lat(), lng: clickPosition.lng() });
      }}
    >
      <Marker clickable={true} onClickableChanged={console.log("cliquei")} />
      <Polygon
        onLoad={onLoad}
        path={coords}
        options={options}
        onClick={(e) => {
          console.log(e.latLng)
          
        }}
      />
    </GoogleMap>
  ) : (
    <></>
  );
};

export default BasicMap;
