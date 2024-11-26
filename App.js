import React, { useEffect, useState, useRef } from "react";
import {View,Image} from "react-native";
import { Provider } from 'react-redux';
import HomeScreen from './app/screens/home';
import SearchWithMap from './app/screens/searchwithmap';
import store from './app/redux/store'; // Import the persisted store and persistor


const App = () => {

 const [splashLoading, setSplashLoading] = useState(true);

  useEffect(() => {
    setTimeout(async () => {
      setSplashLoading(false);
    }, 3500);
  }, []);

if (splashLoading) {
  return (
    <View
      style={{
        justifyContent: "center",
        alignContent: "center",
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <Image
        style={{
          width: "100%",
          resizeMode: "contain",
        }}
        source={require("./assets/animation.gif")}
      />
    </View>
  );
}

return (<Provider store={store}>
        <SearchWithMap />
  </Provider>);

};

export default App;