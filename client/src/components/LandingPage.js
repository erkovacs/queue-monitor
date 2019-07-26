import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

class LandingPage extends Component {
  AUTH_URL = "/api/authenticate/";
  constructor(){
    super();
    this.state = {
      currentUser: null
    };
  }  
  render(){
      return (
        <main role="main" className="container">
          <h1 className="mt-5">Test</h1>
      </main>
    );
  }

  handleLogout = () => {
    //deleteCookie("api_token");
    this.setState({ currentUser: null });
  };

  componentWillMount = async () => {
    //const apiToken = getCookie("api_token");
    const apiToken = '';
    if(apiToken !== ""){
      const res = await fetch(this.AUTH_URL + encodeURIComponent(apiToken));
      const json = await res.json();
      if(json.success){
        this.setState({ ...this.state, currentUser: json.data });
      }
    }
  }

};

export default LandingPage;