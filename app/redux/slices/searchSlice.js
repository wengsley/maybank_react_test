import { createSlice } from '@reduxjs/toolkit';

// Slice to manage search history
const searchSlice = createSlice({
  name: 'search',
  initialState: {
    searches: [],  // Store recent searches here
  },
  reducers: {
    addSearch(state, action) {
      // Add a new search to the history
      state.searches.push(action.payload);
      // Keep only the last 10 searches
      if (state.searches.length > 10) {
        state.searches.shift();  // Remove the oldest search
      }
    },
    clearSearches(state) {
      // Optionally clear the search history
      state.searches = [];
    }
  }
});

export const { addSearch, clearSearches } = searchSlice.actions;
export default searchSlice.reducer;