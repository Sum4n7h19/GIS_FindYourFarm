import React from "react";
import { TileLayer, MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ data }) => {
  const bbox = data.bbox

  const center =[
    (bbox[1]+bbox[3])/2,
    (bbox[0]+bbox[2])/2
  ]
  const zoom = calculateZoom(bbox);

  function calculateZoom(bbox) {
    const latDiff = bbox[3] - bbox[1];
    const lonDiff = bbox[2] - bbox[0];

    const zoomFactor = 0.05;

    const zoomLat = Math.floor(Math.log2(360 / latDiff)) - zoomFactor;
    const zoomLon = Math.floor(Math.log2(360 / lonDiff)) - zoomFactor;

    return Math.min(zoomLat, zoomLon);
  }
  const setColor = ({ properties }) => {
    return { weight: 2, color: "red" };
  };

  return (
    <div className="map-box">
    <MapContainer
      center={center}
      zoom={zoom}
      className="map-container"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON data={data} style={setColor} />
    </MapContainer>
    </div>
  );
};

export default Map;
