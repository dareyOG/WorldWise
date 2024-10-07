import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState } from 'react';
import { useCities } from '../contexts/CitiesContext';
import styles from './Map.module.css';

function Map() {
  const navigate = useNavigate();

  // set map position (lng, lat)
  const [mapPosition, setMapPosition] = useState([6.465422, 3.406448]);

  // log lat & lng from URL
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  const { cities } = useCities();
  console.log(cities);

  return (
    <div
      className={styles.mapContainer}
      // onClick={() => {
      //   navigate('form');
      // }}
    >
      <MapContainer
        center={mapPosition}
        zoom={13}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map(city => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {/* <h1>Map</h1>
      <h1>
        Position: {lat}, {lng}
      </h1> */}
      {/* <button
        onClick={() => {
          setSearchParams({ lat: 23, lng: 50 });
        }}
      >
        Change Position
      </button> */}
    </div>
  );
}

export default Map;
