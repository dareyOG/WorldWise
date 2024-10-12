// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Button from './Button';
import styles from './Form.module.css';
import BackButton from './BackButton';
import { useURLPosition } from '../hooks/useURLPosition';
import Message from './Message';
import Spinner from './Spinner';
import { useCities } from '../contexts/CitiesContext';
import { useNavigate } from 'react-router-dom';

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

function Form() {
  const navigate = useNavigate();

  const { lat, lng } = useURLPosition();
  const { isLoading, createNewCity } = useCities();

  const [isLoadingGeocoding, setIsLoadingGeoCoding] = useState(false);
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [emoji, setEmoji] = useState('');
  const [geocodingError, setGeocodingError] = useState('');

  useEffect(
    function () {
      async function fetchCityData() {
        try {
          setIsLoadingGeoCoding(true);
          setGeocodingError('');
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const cityData = await res.json();
          // console.log(cityData);
          if (!cityData.countryCode)
            throw new Error(
              "That doesn't seem to be a city, do you mind click somehere else?🤔"
            );
          setCityName(cityData.city || cityData.locality);
          setCountry(cityData.countryName);
          setEmoji(convertToEmoji(cityData.countryCode));
        } catch (error) {
          setGeocodingError(error.message);
        } finally {
          setIsLoadingGeoCoding(false);
        }
      }
      fetchCityData();
    },
    [lat, lng]
  );

  const handleSubmit = async e => {
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };
    // create city
    await createNewCity(newCity);
    // navigate back to city list
    navigate('/app/cities');
    // navigate to cities just after creating new city, hence asyn-await
  };

  if (!lat && !lng)
    return <Message message="Start by clicking somewhere on the map" />;
  if (isLoadingGeocoding) return <Spinner />;
  if (geocodingError) return <Message message={geocodingError} />;
  return (
    <form
      className={`${styles.form} ${isLoading ? styles['loading'] : ''}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={e => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input id="date" onChange={e => setDate(e.target.value)} value={date} /> */}
        <DatePicker
          id="date"
          selected={date}
          onChange={date => setDate(date)}
          dateFormat="dd/MM/YYYY"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={e => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
