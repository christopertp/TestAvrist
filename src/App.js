import React from 'react'
import { StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DBProvider } from './../src/context/db'
import SplashScreen from './screens/Splash'
import HomeScreen from './screens/Home'
import DetailsScreen from './screens/Detail'
import LoginScreen from './screens/Login'
import EditUserScreen from './screens/EditUser'

const Stack = createNativeStackNavigator();

// const HomeScreen = ({navigation}) => {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Home Screen</Text>
//       <Button
//         title="Go to Details"
//         onPress={() => navigation.push('Details')}
//       />
//     </View>
//   );
// }

// const DetailsScreen = () => {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Details Screen</Text>
//     </View>
//   );
// }

export default function App() {
  return (
    <NavigationContainer>
      <DBProvider>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Detail" component={DetailsScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="EditUser" component={EditUserScreen} />
        </Stack.Navigator>
      </DBProvider>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({})
