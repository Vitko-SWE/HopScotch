import './App.css';
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
