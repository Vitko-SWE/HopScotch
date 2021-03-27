import './App.css';
import {
  Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import NoMatch from 'react-router-nomatch';
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
          <Route path="/direction" render={() => {window.location.href="Directions.html"}} />
          <Route path="/map" render={() => {window.location.href="Map.html"}} />
          <ProtectedRoute path="/homepage" component={Homepage} exact/>
          <ProtectedRoute path="/Account"  component={Profile} exact/>
          <ProtectedRoute path="/createtrip"  component={CreateTrip} exact/>
          <ProtectedRoute path="/edittrip/:tripid"  component={EditTrip} exact/>
          <Route component={NoMatch} />
          <Route onEnter={() => window.location.reload()} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
