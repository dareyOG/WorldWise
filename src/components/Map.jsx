import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useCities } from '../contexts/CitiesContext';
import styles from './Map.module.css';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from './Button';

function Map() {
  // const navigate = useNavigate();

  // set map position (lng, lat)
  const [mapPosition, setMapPosition] = useState([40, 0]);
  // log lat & lng from URL
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    getPosition,
    isLoading: isLoadingPosition,
    error,
    position: geoPosition,
  } = useGeolocation();

  const mapLat = searchParams.get('lat');
  const mapLng = searchParams.get('lng');

  const { cities } = useCities();
  // console.log(cities);

  // update map position
  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  // sync map position with geoPosition
  useEffect(
    function () {
      if (geoPosition) setMapPosition([geoPosition.lat, geoPosition.lng]);
    },
    [geoPosition]
  );

  return (
    <div
      className={styles.mapContainer}
      // onClick={() => {
      //   navigate('form');
      // }}
    >
      {/* display button when not in current location */}
      {!geoPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? 'Loading...' : 'take your position'}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        // center={[mapLat, mapLng]}
        zoom={9}
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
        <ChangeCenter position={mapPosition} />
        <ClickMap />
      </MapContainer>
      {/* <h1>Map</h1>
      <h1>
        Position: {lat}, {lng}
      </h1>
      <button
        onClick={() => {
          setSearchParams({ lat: 23, lng: 50 });
        }}
      >
        Change Position
      </button> */}
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return;
}

// display form on map click
function ClickMap() {
  const navigate = useNavigate();

  useMapEvents({
    click: e => {
      // console.log(e);
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
