import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import MenuBar from './Components/MenuBar/MenuBar.js';
import Homepage from './Components/Homepage/Homepage.js';

function App() {
  return (
    <Router>
      <div className="App">
        <MenuBar />

        <Switch>
          <Route path="/example">
            <div style={{marginTop: 100+"px"}}>
              Hello World!
            </div>
          </Route>
          <Route path="/">
            <Homepage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
