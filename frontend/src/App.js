import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Profile from './Components/ProfileInfo/Profile';
import MenuBar from './Components/MenuBar/MenuBar'
import Landing from './Components/Landing/Landing.js';
import Homepage from './Components/Homepage/Homepage.js';
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
        <MenuBar />

        <Switch>
          <Route path="/" component={Landing} exact />
          <ProtectedRoute path="/homepage" component={Homepage} exact/>
          <ProtectedRoute path="/Account" exact component={Profile} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
