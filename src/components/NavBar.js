import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
class NavBar extends Component {




    render() {
        return (
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <a
                    className="navbar-brand col-sm-3 col-md-2 mr-0"
                    href="http://www.dappuniversity.com/bootcamp"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Monyneath Dapp Test {this.props.account}
                </a>
                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                        <small className="text-white"><span id="account">{this.props.account}</span></small>
                    </li>
                </ul>
            </nav>
        );
    }
}

export default NavBar;
