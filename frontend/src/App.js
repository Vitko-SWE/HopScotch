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
import SearchDining from './Components/Search/SearchDining'
import DiningResults from './Components/Search/SearchDiningResults'
import SearchHotel from './Components/SearchHotel/SearchHotel'
import AttractionSearch from './Components/AttractionSearch/AttractionSearch';
import MainSearch from './Components/Search/MainSearch';
import { createBrowserHistory } from 'history';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import VotingCard from './Components/EditTrip/components/VotingCard';
import FlightSearch from './Components/FlightSearch/FlightSearch';
import FlightSearchResults from "./Components/FlightSearchResults/FlightSearchResults.js";
import AgendaView from './Components/AgendaView/AgendaView';
import EditTripView from './Components/EditTrip/EditTripView';
import Budgeting from './Components/EditTrip/components/Budgeting';
import Vote from './Components/EditTrip/components/Vote'

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
          <Route path="/directions" render={() => {window.location.href="Directions.html"}} />
          <Route path="/map" render={() => {window.location.href="Map.html"}} />
          <ProtectedRoute path="/homepage" component={Homepage} exact/>
          <ProtectedRoute path="/Account"  component={Profile} exact/>
          <ProtectedRoute path="/createtrip"  component={CreateTrip} exact/>
          <ProtectedRoute path="/searchDining"  component={SearchDining} exact/>
          <ProtectedRoute path="/searchHotel"  component={SearchHotel} exact/>
          {/* <ProtectedRoute path="/DiningResults"  component={DiningResults} exact/> */}
          <ProtectedRoute path="/edittrip/:tripid"  component={EditTrip} exact/>
          <ProtectedRoute path="/editview/:tripid"  component={EditTripView} exact/>
          <ProtectedRoute path="/editview/budgeting/:tripid"  component={Budgeting} exact/>
          <ProtectedRoute path="/editview/vote/:tripid"  component={Vote} exact/>
          <ProtectedRoute path="/search/flights" component={FlightSearch} exact />
          <ProtectedRoute path="/search/flights/results" component={FlightSearchResults} exact />
          <ProtectedRoute path="/attractionsearch/"  component={AttractionSearch} exact/>
          <ProtectedRoute path="/search/"  component={MainSearch} exact/>
          <ProtectedRoute path="/AgendaView/:tripid"  component={AgendaView} exact/>
          <Route path="/testrender/votingcard" component={VotingCard} exact />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
