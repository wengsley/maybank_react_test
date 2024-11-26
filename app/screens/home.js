import React, { createRef, useState,useRef } from 'react';
import { View, StyleSheet,SafeAreaView, Text} from 'react-native';
import { Input, List } from '@ant-design/react-native';
import MapView, { Marker, AnimatedRegion, Animated,MarkerAnimated } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlaces } from '../redux/actions/searchActions';
import axios from 'axios';


const HomeScreen = () => {
  const [query, setQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 3.139003,
    longitude: 101.686852,
  });
  const mapRef = useRef(null);


  const dispatch = useDispatch();
  const { places, loading } = useSelector((state) => state.search);

  const handleSearch = (text) => {
    setQuery(text);
    dispatch(fetchPlaces(text));
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
  };

  const handleSelectPlace = async (place) => {

    // console.log("test1 = "+JSON.stringify(place.place_id));
    const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&key=AIzaSyDauxNXksOZZ0nCg6x_01STF5llcdP90Ng`
    );

    if(response.status == 200)
    {
        const location = {
            latitude: response.data.result.geometry.location.lat,
            longitude: response.data.result.geometry.location.lng,
          };

          setSelectedLocation(location);

          moveToMarker();
    }
   
  };

//   const onRegionChange= (text) => {
//     this.state.region.setValue(region);
//   };

  return (
    <SafeAreaView style={styles.container}>
      <Input
        value={query}
        onChangeText={handleSearch}
        placeholder="Search Places"
        style={styles.input}
      />
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: 3.139003,
            longitude: 101.686852,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          region={selectedLocation}
          onPress={(event) => {
            const { latitude, longitude } = event.nativeEvent.coordinate;

            const location = {
                latitude: latitude,
                longitude: longitude,
              };
            setSelectedLocation(location);
            moveToMarker(); // Move the map to the new marker
          }}
        >
          {selectedLocation && <Marker coordinate={selectedLocation} />}
        </MapView>
      </View>
      {loading ? (
        <View><Text>Loading...</Text></View>
      ) : (
        <List>
          {places.map((place) => (
            <List.Item key={place.place_id} onPress={() => handleSelectPlace(place)}>
              {place.description}
            </List.Item>
          ))}
        </List>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  input: { margin: 10 },
  mapContainer: { flex: 1, marginTop: 10 },
});

export default HomeScreen;
