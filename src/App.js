
import { createStackNavigator, createAppContainer } from 'react-navigation';
import HomePage from "./screens/HomePage";
import SignUp from "./screens/SignUp"
import SignUpForm from "./components/SignUpForm"


console.disableYellowBox = true
const AppNavigation = createStackNavigator({
  Home: HomePage,
  SignUp: SignUp,
  SignUpForm: SignUpForm
});

export default createAppContainer(AppNavigation)

