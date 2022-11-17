import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from '../screens/Home';
import { Details } from '../screens/Details';
import { Register } from '../screens/Register';
import { Historical } from '../screens/Historical';
import { Account } from '../screens/Account';

const { Navigator, Screen } = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="home" component={Home} />
      <Screen name="new" component={Register} />
      <Screen name="details" component={Details} />
      <Screen name="historical" component={Historical} />
      <Screen name="account" component={Account} />
    </Navigator>
  )
}