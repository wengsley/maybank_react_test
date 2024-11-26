import React, { useState, useRef,useEffect } from 'react';
import { View, TextInput, FlatList, Text,TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import { fetchPlaces, setSelectedLocation, clearRecentSearches ,clearHistorySearches, setHistorySearches} from '../redux/slices/placesSlice';
import axios from 'axios';
import * as Location from 'expo-location';
import { Button,Icon,Input } from '@ant-design/react-native';





const SearchWithMap = () => {
  const dispatch = useDispatch();
  const { recentSearches, historySearches, loading, error, selectedLocation } = useSelector((state) => state.places);
  const [query, setQuery] = useState('');
  const [flatListVisible, setFlatListVisible] = useState(false);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const sampleData = [
    {"description":"Pavilion Road, London, UK","matched_substrings":[{"length":8,"offset":0}],"place_id":"EhlQYXZpbGlvbiBSb2FkLCBMb25kb24sIFVLIi4qLAoUChIJC9fDiz4FdkgR5mAO2NRrjH4SFAoSCfPzF7dbG3ZIEQqyADl5LpFJ","reference":"EhlQYXZpbGlvbiBSb2FkLCBMb25kb24sIFVLIi4qLAoUChIJC9fDiz4FdkgR5mAO2NRrjH4SFAoSCfPzF7dbG3ZIEQqyADl5LpFJ","structured_formatting":{"main_text":"Pavilion Road","main_text_matched_substrings":[{"length":8,"offset":0}],"secondary_text":"London, UK"},"terms":[{"offset":0,"value":"Pavilion Road"},{"offset":15,"value":"London"},{"offset":23,"value":"UK"}],"types":["route","geocode"]},
    {"description":"Klia Departure, Kuala Lumpur International Airport, Selangor, Malaysia","matched_substrings":[{"length":4,"offset":0}],"place_id":"EkZLbGlhIERlcGFydHVyZSwgS3VhbGEgTHVtcHVyIEludGVybmF0aW9uYWwgQWlycG9ydCwgU2VsYW5nb3IsIE1hbGF5c2lhIi4qLAoUChIJKVSKMIG_zTERjFP1Tacz7lcSFAoSCVVV94d2wM0xERT0FISis95l","reference":"EkZLbGlhIERlcGFydHVyZSwgS3VhbGEgTHVtcHVyIEludGVybmF0aW9uYWwgQWlycG9ydCwgU2VsYW5nb3IsIE1hbGF5c2lhIi4qLAoUChIJKVSKMIG_zTERjFP1Tacz7lcSFAoSCVVV94d2wM0xERT0FISis95l","structured_formatting":{"main_text":"Klia Departure","main_text_matched_substrings":[{"length":4,"offset":0}],"secondary_text":"Kuala Lumpur International Airport, Selangor, Malaysia"},"terms":[{"offset":0,"value":"Klia Departure"},{"offset":16,"value":"Kuala Lumpur International Airport"},{"offset":52,"value":"Selangor"},{"offset":62,"value":"Malaysia"}],"types":["route","geocode"]},
    {"description":"Kuala Lumpur City Centre, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia","matched_substrings":[{"length":24,"offset":0}],"place_id":"ChIJ14gJ49NJzDERmsAj2n9LSkY","reference":"ChIJ14gJ49NJzDERmsAj2n9LSkY","structured_formatting":{"main_text":"Kuala Lumpur City Centre","main_text_matched_substrings":[{"length":24,"offset":0}],"secondary_text":"Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia"},"terms":[{"offset":0,"value":"Kuala Lumpur City Centre"},{"offset":26,"value":"Kuala Lumpur"},{"offset":40,"value":"Federal Territory of Kuala Lumpur"},{"offset":75,"value":"Malaysia"}],"types":["sublocality_level_1","geocode","political","sublocality"]},
    {"description":"Persiaran TRX, Imbi, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia","matched_substrings":[{"length":3,"offset":10}],"place_id":"Ek5QZXJzaWFyYW4gVFJYLCBJbWJpLCBLdWFsYSBMdW1wdXIsIEZlZGVyYWwgVGVycml0b3J5IG9mIEt1YWxhIEx1bXB1ciwgTWFsYXlzaWEiLiosChQKEgltYsgGMDbMMRFptocxIVQYnhIUChIJTaYN3TE2zDER5N8355Clcck","reference":"Ek5QZXJzaWFyYW4gVFJYLCBJbWJpLCBLdWFsYSBMdW1wdXIsIEZlZGVyYWwgVGVycml0b3J5IG9mIEt1YWxhIEx1bXB1ciwgTWFsYXlzaWEiLiosChQKEgltYsgGMDbMMRFptocxIVQYnhIUChIJTaYN3TE2zDER5N8355Clcck","structured_formatting":{"main_text":"Persiaran TRX","main_text_matched_substrings":[{"length":3,"offset":10}],"secondary_text":"Imbi, Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia"},"terms":[{"offset":0,"value":"Persiaran TRX"},{"offset":15,"value":"Imbi"},{"offset":21,"value":"Kuala Lumpur"},{"offset":35,"value":"Federal Territory of Kuala Lumpur"},{"offset":70,"value":"Malaysia"}],"types":["geocode","route"]}
  ];

  useEffect(() => {
    (async () => {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied.');
        Alert.alert('Permission Denied', 'Please enable location services in your settings.');
        return;
      }

      // Fetch the current location
      const currentLocation = await Location.getCurrentPositionAsync({});

       const location = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      dispatch(setSelectedLocation(location));

      // if(historySearches.length == 0)
      // {
      //   // sampleData.map((data, index) => (
      //   //   dispatch(setHistorySearches(data))
      //   // ));
      // }
    })();
  }, []); // Runs only once when the component mounts

  const mapRef = useRef(null);
  // Handle user input and fetch results
  const handleSearch = (text) => {
    setQuery(text);
    if (text) {
      dispatch(fetchPlaces(text)); // Call the Google Places API
    }
  };


    const getCurrentLocation = async () => {
      // Fetch the location
      console.log("req=");

      setLoadingIndicator(true);
      const currentLocation = await Location.getCurrentPositionAsync({});

      console.log("locaiton"+currentLocation);
      const location = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      dispatch(setSelectedLocation(location));
      moveToMarker();
    };

  const moveToMarker = () => {
    console.log("test");
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000); // Animation duration in milliseconds
    }
    setLoadingIndicator(false);
  };

  // Handle selection of a place
  const handleSelectPlace = async (place) => {
    setLoadingIndicator(true);
    // Mock lat/lng for demonstration (you should use Place Details API to get actual coordinates)
    console.log("req="+JSON.stringify(place));

    const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&key=AIzaSyDauxNXksOZZ0nCg6x_01STF5llcdP90Ng`
    );

    // console.log("response="+JSON.stringify(response));
    if(response.status == 200)
    {
        const location = {
            latitude: response.data.result.geometry.location.lat,
            longitude: response.data.result.geometry.location.lng,
          };

          dispatch(setSelectedLocation(location));
          moveToMarker();
          dispatch(clearRecentSearches());
          console.log("historySearches="+JSON.stringify(historySearches));

          if(query != null || query != '')
          { 
            dispatch(setHistorySearches(place));
          }

          console.log("historySearches="+JSON.stringify(historySearches));
    }
  };

  const showFlatList = () => {
     if(flatListVisible == true)
     {
       setFlatListVisible(false)
     } else {
       setFlatListVisible(true)
     }
  };

  const clearSearchHistory = () => {
      dispatch(clearHistorySearches());
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <SafeAreaView style={styles.inputContainer}>
        {/* <TextInput
          style={styles.input}
          placeholder="Search for a place..."
          value={query}
          onChangeText={handleSearch}
          onFocus={showFlatList}
        /> */}

        <Input 
          style={styles.input}
          placeholder="Search for a place..." 
          variant="borderless" 
          value={query} 
          onChangeText={handleSearch}
          onFocus={showFlatList}/>
      
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>

      {/* Display loading or error */}
      {loading && <Text style={styles.loading}>Loading...</Text>}
      {errorMessage && <Text style={styles.error}>Error: {errorMessage}</Text>}

      {/* Display search results */}
      {flatListVisible ? (    
        <View> 
          { (query =='' || query == null)?
           (
            <View style={{ flexDirection: "row" }}>

                 { (historySearches.length > 0)?
                  (<Text style={{ alignItems: "flex-start",justifyContent:"flex-start" }}>Recent Search</Text>):
                  (<Text style={{ alignItems: "flex-start",justifyContent:"flex-start" }}>Recommended Search</Text>)
                 }  
            </View>
           ):"" 
          }   
          <FlatList
            data={(query == null|| query == '')? ((historySearches.length > 0)? historySearches: sampleData): recentSearches}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => handleSelectPlace(item)}>
                <Text>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
      </View>  
      ):""
      }       


      { (loadingIndicator) ?
      (<ActivityIndicator size="large" color="grey" style={{ flex: 3 }} />):
        
     
      (
      <MapView
        ref={mapRef}
        style={styles.map}
        region={{
          latitude: selectedLocation?.latitude || 37.7749, // Default to SF if no location selected
          longitude: selectedLocation?.longitude || -122.4194,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={(event) => {
          const { latitude, longitude } = event.nativeEvent.coordinate;

          const location = {
              latitude: latitude,
              longitude: longitude,
            };
          dispatch(setSelectedLocation(location));
          moveToMarker(); // Move the map to the new marker
        }}
      >
        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
            title={selectedLocation.name}
          />
        )}
      
      </MapView>)
      }

        <Button type="primary" style={styles.floatingButton} onPress={getCurrentLocation}>
          <Icon name="plus" size="md" color="#fff" /> 
        </Button>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    margin: 10,
  },
  loading: { textAlign: 'center', marginVertical: 10 },
  error: { textAlign: 'center', color: 'red', marginVertical: 10 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  map: { flex: 1, marginTop: 10 },
  clearButton: {
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  clearButtonText: {
    fontSize: 16,
    color: 'gray',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 15,
    width: '100%',
    backgroundColor: 'transparent'
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20, // Distance from the bottom of the screen
    right: 20, // Distance from the right edge
    width: 60,
    height: 60,
    borderRadius: 30, // Make it circular
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchWithMap;
