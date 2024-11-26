import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlaces, setQuery, clearRecentSearches } from './placesSlice';

const SearchScreen = () => {
  const dispatch = useDispatch();
  const { recentSearches, query, loading, error } = useSelector((state) => state.places);

  // Handle the search input change
  const handleSearchInput = (e) => {
    const newQuery = e.target.value;
    dispatch(setQuery(newQuery));
    
    // Dispatch fetch action when the user types in the search box
    if (newQuery) {
      dispatch(fetchPlaces(newQuery));
    }
  };

  // Handle clear recent searches
  const handleClearSearches = () => {
    dispatch(clearRecentSearches());
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleSearchInput}
        placeholder="Search for a place..."
      />
      
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <button onClick={handleClearSearches}>Clear Recent Searches</button>

      {recentSearches.length > 0 && (
        <ul>
          {recentSearches.map((result, index) => (
            <li key={index}>
              {result.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchScreen;
