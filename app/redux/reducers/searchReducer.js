import { FETCH_PLACES_REQUEST, FETCH_PLACES_SUCCESS, FETCH_PLACES_ERROR } from '../actions/searchActions';

const initialState = {
  loading: false,
  places: [],
  error: null,
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PLACES_REQUEST:
      return { ...state, loading: true };
    case FETCH_PLACES_SUCCESS:
      return { ...state, loading: false, places: action.payload };
    case FETCH_PLACES_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default searchReducer;
