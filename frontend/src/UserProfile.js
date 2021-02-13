import React from 'react';
import './UserProfile.css';
import DefaultHead from "./default_head.jpg";
import axios from 'axios';
//https://github.com/bradtraversy/react_file_uploader

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
    fileUploadHandler = () => {
        axios.post('');
    }

    openTab(evt, cityName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active";
    }

    render() {
        return (
            <div className="container">
                <div className="circular-pic">
                    <img src={DefaultHead} alt="profile pic" height="150" width="150" />
                </div>
                <button className="hbtn hb-border-top-br3" onClick={() => window.location.href = '/'}>Home</button>
                <h2>Dude Dudeson</h2>
                <h3>About Dude</h3>
                <p>October arrived, spreading a damp chill over the grounds and into the castle. Madam Pomfrey, the nurse, was kept busy by a sudden spate of colds...</p>

                <div class="tab">
                    <button class="tablinks" id="defaultOpen" onClick={(e) => this.openTab(e, 'Picture')}>Profile Pic</button>
                    <button class="tablinks" onClick={(e) => this.openTab(e, 'Email')}>Email</button>
                    <button class="tablinks" onClick={(e) => this.openTab(e, 'Password')}>Password</button>
                    <button class="tablinks" onClick={(e) => this.openTab(e, 'Something')}>Other</button>
                </div>

                <div id="Picture" class="tabcontent">
                    <h3>Change Profile Picture</h3>
                    <input type="file" onChange={this.fileSelectedHandler} /><br></br>
                    <button className="hbtn hb-border-top-br3" onClick={this.fileUploadHandler}>Upload</button><br></br>
                </div>

                <div id="Email" class="tabcontent">
                    <h3>Change email address</h3>
                    <form>
                        <div class="input-container">
                                <i class="fa fa-envelope icon"></i>
                                <input class="input-field" type="email" placeholder="Old Email" name="email"/>
                        </div>
                        <div class="input-container">
                            <i class="fa fa-envelope icon"></i>
                            <input class="input-field" type="email" placeholder="New Email" name="email"/>
                        </div>
                        
                    </form>
                    <button className="hbtn hb-border-top-br3" type="submit">Submit</button>
                </div>

                <div id="Password" class="tabcontent">
                    <h3>Change password</h3> 
                    <form>
                        <div class="input-container">
                                <i class="fa fa-key icon"></i>
                                <input class="input-field" type="password" placeholder="Old Password" name="password"/>
                        </div>
                        <div class="input-container">
                            <i class="fa fa-key icon"></i>
                            <input class="input-field" type="password" placeholder="New Password" name="password"/>
                        </div>
                        
                    </form>
                    <button className="hbtn hb-border-top-br3" type="submit">Submit</button>
                </div>

                <div id="Something" class="tabcontent">
                    <h3>SOMETHING HERE</h3>
                </div>

            </div>
        );
    }
}

export default UserProfile;