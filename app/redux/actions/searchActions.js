import axios from 'axios';

export const FETCH_PLACES_REQUEST = 'FETCH_PLACES_REQUEST';
export const FETCH_PLACES_SUCCESS = 'FETCH_PLACES_SUCCESS';
export const FETCH_PLACES_ERROR = 'FETCH_PLACES_ERROR';

export const fetchPlaces = (query) => async (dispatch) => {
  dispatch({ type: FETCH_PLACES_REQUEST });
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=geocode&key=AIzaSyDauxNXksOZZ0nCg6x_01STF5llcdP90Ng`
    );
    // console.log("result =".JSON.stringify(response.data));
    dispatch({ type: FETCH_PLACES_SUCCESS, payload: response.data.predictions });
  } catch (error) {
    dispatch({ type: FETCH_PLACES_ERROR, payload: error.message });
  }
};
