/* eslint-disable no-unreachable */
import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Polygon,
} from "@react-google-maps/api";
import axios from "axios";
import { baseURL } from "api";
import { GOOGLE_MAPS_API_KEY } from "utils/constans";
import { toast } from "react-toastify";

export const BasicMap = ({
  city,
  newCoords,
  setNewCoords,
  position,
  polygonRef
}) => {
  const [center, setCenter] = useState(newCoords.length > 0 ? newCoords[0] : { lat: 0, lng: 0 });
  const [changeIndex, setChangeIndex] = useState(-1);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const options = {
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.2,
    clickable: true,
    draggable: true,
    editable: true,
    visible: true,
    radius: 30000,
    zIndex: 1,
    path: newCoords,
  };

  const cityValue = encodeURI(city);

  const url = `${baseURL}/proxy?query=${cityValue}`;

  useEffect(() => {
    if (!city) return

    axios
      .get(url)
      .then((res) => {
        setCenter({
          lat: res.data.data.results[0].geometry.location.lat,
          lng: res.data.data.results[0].geometry.location.lng,
        });
      })
      .catch((err) => {
        toast.error("Erro ao buscar a cidade");
      });
  }, [city, url]);

  console.log("Posição atual", position);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={center}
      zoom={13}
      onClick={(e) => {
        const clickPosition = e.latLng;
        setNewCoords([
          { lat: clickPosition.lat(), lng: clickPosition.lng() },
          ...newCoords,
        ]);
      }}
    >
      {newCoords.length > 0 &&
        <Polygon
          ref={polygonRef}
          draggable={true}
          editable={true}
          path={newCoords}
          options={options}
          onDrag={e => {
            console.log({e})
          }}
          onMouseDown={e => {
            newCoords.map((element, idx) => {
              if(e.latLng.lat() === element.lat && e.latLng.lng() === element.lng) {
                setChangeIndex(idx);
              }
              return null
            });
          }}
          onMouseUp={(e) => {
            if(changeIndex >= 0 && changeIndex < newCoords.length) {
              newCoords[changeIndex] = { lat: e.latLng.lat(), lng: e.latLng.lng() };
              setNewCoords([...newCoords])
              setChangeIndex(-1);
              console.log('mudou o ', changeIndex)
            } else {
              console.log('criou novo')
              setNewCoords([...newCoords, { lat: e.latLng.lat(), lng: e.latLng.lng() }])
            }
          }}
        />
      }
    </GoogleMap>
  ) : (
    <></>
  );
};
