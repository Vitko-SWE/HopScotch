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


function App() {
  return (
    <Router>
      <div className="App">
        <MenuBar/>
        <Switch>
          <Route path="/" exact component={Homepage}/>
          <Route path="/Account" exact component={Profile} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
