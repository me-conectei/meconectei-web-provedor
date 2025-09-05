import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Polygon,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import axios from "axios";
import { baseURL } from "api";

const BasicMap = ({ city, coords, setCoords, position, setPosition, mapsKey, importedData = [] }) => {
  // eslint-disable-next-line
  const [_nonused, setCenter] = useState({
    lat: -26.3825645832962,
    lng: -48.829166464261704,
  });
  // eslint-disable-next-line
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: mapsKey,
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

  const url = `${baseURL}/proxy?query=${cityValue}`;

  useEffect(() => {
    if (!city) return;
    
    axios
      .get(url)
      .then((res) => {
        if (res.data && 
            res.data.data && 
            res.data.data.results && 
            res.data.data.results.length > 0 &&
            res.data.data.results[0].geometry &&
            res.data.data.results[0].geometry.location) {
          setPosition({
            lat: res.data.data.results[0].geometry.location.lat,
            lng: res.data.data.results[0].geometry.location.lng,
          });
        }
      })
      .catch((err) => {
        console.log('Erro ao buscar localização da cidade:', err);
      });
  }, [city, url, setPosition]);

  const renderImportedFeatures = () => {
    if (!importedData || importedData.length === 0) return null;

    return importedData.map((file, fileIndex) => {
      if (!file.features || file.features.length === 0) return null;

      return file.features.map((feature, featureIndex) => {
        const key = `imported-${fileIndex}-${featureIndex}`;
        
        if (feature.geometry.type === 'Point') {
          const [lng, lat] = feature.geometry.coordinates;
          return (
            <Marker
              key={key}
              position={{ lat, lng }}
              title={feature.properties?.name || `Ponto ${featureIndex + 1}`}
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="#fff" stroke-width="2"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(24, 24),
              }}
            />
          );
        }
        
        if (feature.geometry.type === 'LineString') {
          const coordinates = feature.geometry.coordinates.map(coord => ({
            lat: coord[1],
            lng: coord[0]
          }));
          return (
            <Polyline
              key={key}
              path={coordinates}
              options={{
                strokeColor: '#FF6B35',
                strokeOpacity: 0.8,
                strokeWeight: 3,
              }}
            />
          );
        }
        
        if (feature.geometry.type === 'Polygon') {
          const coordinates = feature.geometry.coordinates[0].map(coord => ({
            lat: coord[1],
            lng: coord[0]
          }));
          return (
            <Polygon
              key={key}
              path={coordinates}
              options={{
                strokeColor: '#34A853',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#34A853',
                fillOpacity: 0.2,
              }}
            />
          );
        }
        
        if (feature.geometry.type === 'MultiPolygon') {
          return feature.geometry.coordinates.map((polygon, polygonIndex) => {
            const coordinates = polygon[0].map(coord => ({
              lat: coord[1],
              lng: coord[0]
            }));
            return (
              <Polygon
                key={`${key}-${polygonIndex}`}
                path={coordinates}
                options={{
                  strokeColor: '#34A853',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: '#34A853',
                  fillOpacity: 0.2,
                }}
              />
            );
          });
        }
        
        return null;
      });
    });
  };

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
      {renderImportedFeatures()}
    </GoogleMap>
  ) : (
    <h1>Carregando Google Maps</h1>
  );
};

export default BasicMap;
