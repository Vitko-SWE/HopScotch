import React from 'react';
import './UserProfile.css';
import DefaultHead from "./default_head.jpg";
import axios from 'axios';


class UserProfile extends React.Component {
    state = {
        selectedFile: null
    }
    fileSelectedHandler = event => {
        this.setState({
            selectedFile: event.target.files[0]
        })
    }

    //For later... save photo into DB somehow
    //https://www.youtube.com/watch?v=XeiOnkEI7XI
    fileUploadHandler = () => {
        axios.post('');
    }


    render() {
        return (
            <div className="container">
                <div className="circular-pic">
                    <img src={DefaultHead} alt="profile pic" height="150" width="150" />
                </div>
                <h2>Dude Dudeson</h2>
                <h3>About Dude</h3>
                <p>October arrived, spreading a damp chill over the grounds and into the castle. Madam Pomfrey, the nurse, was kept busy by a sudden spate of colds...</p>

                <button className="hbtn hb-border-top-br3" onClick={() => window.location.href = '/'}>Home</button>

            </div>
        );
    }
}

export default UserProfile;