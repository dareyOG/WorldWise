import {
  createContext,
  useState,
  useEffect,
  useContext,
  useReducer,
} from 'react';
// import { json } from 'react-router-dom';

const BASE_URL = 'http://localhost:8000';

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };

    case 'cities/loaded':
      return { ...state, isLoading: false, cities: action.payload };

    case 'city/loaded':
      return { ...state, isLoading: false, currentCity: action.payload };

    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        // set created city to current city
        currentCity: action.payload,
      };

    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities].filter(city => city.id !== action.payload),
        // currentCity: {},
      };

    case 'rejected':
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error('unknown action');
  }
}

function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: 'loading' });
      try {
        // setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        // setCities(data);
        console.log(data);
        dispatch({ type: 'cities/loaded', payload: data });
      } catch (error) {
        // alert('There was an error loading data...');
        dispatch({
          type: 'rejected',
          payload: 'There was an error loading data',
        });
      }
      // finally {
      // setIsLoading(false);
      // }
    }
    fetchCities();
  }, []);

  // =========== Handlers ============

  // fetch currentCity data
  async function getCity(id) {
    console.log(id, currentCity.id);
    if (id === currentCity.id) return;

    dispatch({ type: 'loading' });
    try {
      // setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      // setCurrentCity(data);
      dispatch({ type: 'city/loaded', payload: data });
    } catch (error) {
      // alert('There was an error loading data');
      dispatch({
        type: 'rejected',
        payload: 'There was an error loading city data',
      });
    }
    // finally {
    // setIsLoading(false);
    // }
  }

  // store new city data to API
  async function createNewCity(newCity) {
    dispatch({ type: 'loading' });
    try {
      // setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      // console.log(data);
      // update city list
      // setCities(cities => [...cities, data]);
      dispatch({ type: 'city/created', payload: data });
    } catch (error) {
      // alert('There was an error creating city data');
      dispatch({
        type: 'rejected',
        payload: 'There was an error creating city data',
      });
    }
    // finally {
    // setIsLoading(false);
    // }
  }

  // remove city data from API
  async function deleteCity(id) {
    dispatch({ type: 'loading' });
    try {
      // setIsLoading(true);
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });
      // update city list
      // setCities(cities => cities.filter(city => city.id !== id));
      dispatch({ type: 'city/deleted', payload: id });
    } catch (error) {
      // alert('There was an error deleting city data');
      dispatch({
        type: 'rejected',
        payload: 'There was an error deleting city',
      });
    }
    // finally {
    // setIsLoading(false);
    // }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createNewCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error(
      'CitiesContext was used outside of the CitiesProvider scope'
    );
  return context;
}

export { CitiesProvider, useCities };
