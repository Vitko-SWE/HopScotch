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

function App() {
  return (
    <div className="App">
      <Homepage/>
    </div>
  );
}

export default App;
