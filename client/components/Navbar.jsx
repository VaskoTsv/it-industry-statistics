import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';
import logo from '../images/logo.png';
import {
    _StyledNavigationContainer_,
    _StyledNavigationLogo_,
    _StyledNavigationWrapper_,
    _StyledNavigationGroup_,
    _StyledNavigationTitle_
} from './styled-components/StyledNavigation.js';


export default function Navbar() {
    const renderLeftNavigation = () => {
        return (
            <_StyledNavigationGroup_ className="bp3-navbar-group bp3-align-left">
                <NavLink to="/">
                    <_StyledNavigationLogo_ className="bp3-navbar-heading">
                        <img src={logo} alt="main-logo" />
                    </_StyledNavigationLogo_>
                </NavLink>
                <NavLink to="/">
                    <_StyledNavigationTitle_ className="bp3-navbar-heading">IT Industry Analyzer</_StyledNavigationTitle_>
                </NavLink>
            </_StyledNavigationGroup_>
        );
    }

    const renderRightNavigation = () => {
        const auth = useContext(AuthContext);
        const isAuthenticated = Boolean(auth.token);

        const renderLogoutButton = () => {
            return (
                <button className="bp3-button bp3-minimal bp3-icon-log-out"
                        onClick={() => auth.logout()}>
                    Log out
                </button>
            );
        }

        const renderLoginLink = () => {
            return (
                <NavLink to='/auth'>
                    <button className="bp3-button bp3-minimal bp3-icon-log-in">
                        Login/Register
                    </button>
                </NavLink>
            );
        }

        const renderBookmarksLink = () => {
            return (
                <NavLink to="/bookmarked-companies">
                    <button className="bp3-button bp3-minimal bp3-icon-bookmark">
                        Bookmarked
                    </button>
                </NavLink>
            );
        }

        return (
            <_StyledNavigationGroup_ className="bp3-navbar-group bp3-align-right">
                <NavLink to="/">
                    <button className="bp3-button bp3-minimal bp3-icon-home">
                        Home
                    </button>
                </NavLink>
                <NavLink to="/city-comparer">
                    <button className="bp3-button bp3-minimal bp3-icon-list">
                        City comparer
                    </button>
                </NavLink>
                {isAuthenticated && renderBookmarksLink()}
                <span className="bp3-navbar-divider" />
                {!isAuthenticated && renderLoginLink()}
                {isAuthenticated && renderLogoutButton()}
            </_StyledNavigationGroup_>
        );
    }

    return (
        <_StyledNavigationWrapper_ className="bp3-navbar">
            <_StyledNavigationContainer_>
                {renderLeftNavigation()}
                {renderRightNavigation()}
            </_StyledNavigationContainer_>
        </_StyledNavigationWrapper_>
    );
}
