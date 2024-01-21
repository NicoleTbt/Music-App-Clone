import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Pressable,
} from 'react-native';
import { Avatar } from 'react-native-paper';
import { Button, Icon } from 'react-native-elements';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

import { createStackNavigator } from '@react-navigation/stack';

import { PaperProvider } from 'react-native-paper';


import { getFirestore, doc, updateDoc, arrayUnion, setDoc, query, where, getDoc, collection, deleteField, arrayRemove, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { app } from './FireBase/config';
import MainContainer from './Components/MainContainer.js';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './redux/reducers.js'


const store = createStore(rootReducer);

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    secondaryContainer: 'transparent'

  },
}

function App() {


  {/**Main Container */ }


  return (
    <PaperProvider theme={theme}>

      <Provider store={store}>
        <PaperProvider theme={theme}>

          <MainContainer />

        </PaperProvider>
      </Provider>


    </PaperProvider>
  );
}
export default App;
