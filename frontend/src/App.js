import './App.css';
// import { BrowserRouter as Router, Route } from "react-router-dom";
// import UserProfile from "./UserProfile"

// function App() {
//   return (
//     <Router>
//         <div>
//           <Route exact path="/userprofile" component={UserProfile} />
//         </div>
//     </Router>
import Homepage from './Components/Homepage/Homepage.js'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Profile from './Components/ProfileInfo/Profile';
import MenuBar from './Components/MenuBar/MenuBar'
import UserProfile from './Components/ProfileInfo/UserProfile'


function App() {
  return (
    <Router>
      <div className="App">
        <MenuBar/>
        <Switch>
          <Route path="/" exact component={Homepage}/>
          <Route path="/Account" exact component={Profile} />
          <Route path="/UserProfile" exact component={UserProfile} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
