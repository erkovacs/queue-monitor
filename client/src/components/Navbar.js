import React from "react";
import { Link, Redirect } from "react-router-dom";

const Navbar = props => {
    return(
        <header>
        <nav className={`navbar navbar-expand-lg ${props.color} ${props.type}`} id="mainNav">
            
                <Link to="/" className="navbar-brand js-scroll-trigger">Queue Monitor Tool</Link>
                <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    <i className="fas fa-bars"></i>
                </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        { 
                            props.currentUser === null
                            ? <Link className="nav-link js-scroll-trigger" to="/login">Log in</Link>
                            : <a className="nav-link js-scroll-trigger">{props.currentUser.firstname + " " + props.currentUser.lastname}</a>
                        }
                    </li>
                    { 
                            props.currentUser !== null
                        ? <li className="nav-item">
                            <a className="nav-link js-scroll-trigger" onClick={ e => { e.preventDefault(); props.handleLogout()}}>Log Out</a>
                        </li>
                        : null
                    }
                    { 
                            props.currentUser !== null && props.currentUser.role_id === 1
                        ? <li className="nav-item">
                            <Link to="/admin/" className="nav-link js-scroll-trigger"><i className="fa fa-cog"></i></Link>
                        </li>
                        : null
                    }
                    </ul>
                
            </div>
        </nav>
        </header>
    );
}

export default Navbar;