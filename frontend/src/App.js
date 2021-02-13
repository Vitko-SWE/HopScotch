import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import UserProfile from "./UserProfile"

function App() {
  return (
    <Router>
        <div>
          <Route exact path="/userprofile" component={UserProfile} />
        </div>
    </Router>
  );
}

export default App;
