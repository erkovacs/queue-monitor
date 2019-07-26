import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Login from './components/Login';
import SignUp from './components/SignUp';
import InstanceList from "./components/InstanceList";
import AgentList from "./components/AgentList";
import "./App.css";

function App() {
  return (
    <Router>
        <Navbar color="navbar-light" type="fixed-top" currentUser={null} handleLogout={() => false}/>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/instance-list" component={InstanceList} />
          <Route exact path="/agent-list" component={AgentList} />
        </Switch>
        <Footer/>
      </Router>
  );
}

export default App;
