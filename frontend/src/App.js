import './App.css';
import {
  Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import MenuBar from './Components/MenuBar/MenuBar.js';
import Landing from './Components/Landing/Landing.js';
import Homepage from './Components/Homepage/Homepage.js';
import Profile from './Components/ProfileInfo/Profile';
import CreateTrip from './Components/CreateTrip/CreateTrip';
import EditTrip from './Components/EditTrip/EditTrip';
import { createBrowserHistory } from 'history';
import { withAuthenticationRequired } from '@auth0/auth0-react';

export const history = createBrowserHistory();

const ProtectedRoute = ({ component, ...args }) => (
  <Route component={withAuthenticationRequired(component)} {...args} />
);

function App() {
  return (
    <Router history={history}>
      <div className="App">
        <MenuBar/>
        <Switch>
          <Route path="/" component={Landing} exact />
          <ProtectedRoute path="/homepage" component={Homepage} exact/>
          <ProtectedRoute path="/Account"  component={Profile} exact/>
          <ProtectedRoute path="/createtrip"  component={CreateTrip} exact/>
          <ProtectedRoute path="/edittrip/:tripid"  component={EditTrip} exact/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
