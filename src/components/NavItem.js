import React from 'react'
import {NavLink} from "react-router-dom";
import '../css/Navbar.css'
import PropTypes from "prop-types";

export class NavItem extends React.Component {
    render() {
        //border-bottom: 1px solid #000
        return (
            <div className='nav-tab-div'>
                <NavLink
                    style={isActive => ({
                        color: isActive ? "#5ECE7B" : "black",
                        textDecoration: "none",
                        borderBottom: isActive? "2px solid #5ECE7B" : ""
                    })}
                    to={this.props.path}
                    activeClassName='active-tab'>
                        {this.props.name.toUpperCase()}
                </NavLink>
            </div>
        );
    }
}

NavItem.propTypes = {
    path: PropTypes.string,
    name: PropTypes.string
}