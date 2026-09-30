"use client"
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerImage from '@/assets/marker.png';
// Create a default icon for Leaflet markers
const DefaultIcon = L.icon({
    iconUrl: markerImage.src, 
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapSection = () => {
    return (
        <div className="mt-10">
        <h3 className="text-2xl font-semibold text-center  mb-4">
          Our Location
        </h3>
        <MapContainer
          center={[37.7749, -122.4194]} // Coordinates for San Francisco
          zoom={13}
          scrollWheelZoom={false}
          className="h-96 rounded-lg shadow-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[37.7749, -122.4194]} aria-label="San Francisco Location">
            <Popup>
              We are here!<br /> 123 Tech Street, San Francisco, CA
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    );
};

export default MapSection;