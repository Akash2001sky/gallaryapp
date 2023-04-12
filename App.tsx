/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Imagepicker from './components/Image';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Singleimage from './components/Singleimage';

const Stack = createStackNavigator();
class App extends React.Component{

  render(): React.ReactNode {
    return(
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown:false}}>
          <Stack.Screen name='Image' component={Imagepicker}/>
          <Stack.Screen name='Singleimage' component={Singleimage}/>
        </Stack.Navigator>
      
      </NavigationContainer>
    )
  }
}

export default App;
