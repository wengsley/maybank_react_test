import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { MaterialIcons } from "@expo/vector-icons";



const SplashScreen = ({ navigation }) => {


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animatable.Image
          animation="bounceIn"
          duraton="1500"
          style={styles.logo}
          source={require("../assets/logo.png")}
        />
      </View>
      <Animatable.View style={styles.footer} animation="fadeInUp">
        <Text style={styles.title}>Stay connected with everyone!</Text>
        <Text style={styles.text}>Sign in with account</Text>
        <View style={styles.button}>
          <TouchableOpacity
            onPress={() => navigation.navigate("SignInScreen")}
            style={styles.signIn}
          >
            <Text style={styles.textSign}>Get Started</Text>
            <MaterialIcons name="navigate-next" color="#fff" size={20} />
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

export default SplashScreen;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DC143C",
  },
  title: {
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
  },
  logo: {
    width: height_logo,
    height: height_logo,
    resizeMode: "contain",
  },
  header: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    flexDirection: "row",
    backgroundColor: "#DC143C",
  },
  textSign: {
    color: "white",
    fontWeight: "bold",
  },
  text: {
    color: "grey",
    marginTop: 5,
  },
  button: {
    alignItems: "flex-end",
    marginTop: 30,
  },
});
