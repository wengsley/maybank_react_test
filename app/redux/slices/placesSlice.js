import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to call Google Places API
export const fetchPlaces = createAsyncThunk(
  'places/fetchPlaces',
  async (query, { rejectWithValue }) => {
    const API_KEY = 'AIzaSyDauxNXksOZZ0nCg6x_01STF5llcdP90Ng'; // Replace with your API Key
    const endpoint = `https://maps.googleapis.com/maps/api/place/autocomplete/json`;
    const url = `${endpoint}?input=${query}&key=${API_KEY}&types=geocode`;

    try {
      const response = await axios.get(url);
      return response.data.predictions; // Returns the results
    } catch (error) {
      return rejectWithValue(error.response?.data?.error_message || 'Error fetching places');
    }
  }
);

const placesSlice = createSlice({
  name: 'places',
  initialState: {
    recentSearches: [], // Recent search results
    historySearches: [],
    loading: false,     // Loading state
    error: null,        // Error state
    selectedLocation: null, // Stores the selected location
  },
  reducers: {
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload; // Stores the selected place details
    },
    setHistorySearches: (state, action) => {

      let data = state.historySearches;

      let incoming_data = action.payload;

      const place_ids = data.map(item => item.place_id);

      if(!place_ids.includes(incoming_data.place_id))
      {
        state.historySearches.push(action.payload);
      }
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    clearHistorySearches: (state) => {
      state.historySearches = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaces.fulfilled, (state, action) => {
        state.loading = false;
        state.recentSearches = action.payload; // Save API results
      })
      .addCase(fetchPlaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Save error message
      });
  },
});

export const { setSelectedLocation, setHistorySearches, clearHistorySearches ,clearRecentSearches } = placesSlice.actions;
export default placesSlice.reducer;
