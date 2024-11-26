import { configureStore } from '@reduxjs/toolkit';
import placesReducer from './slices/placesSlice';

const store = configureStore({
  reducer: {
    places: placesReducer,
  },
});

export default store;