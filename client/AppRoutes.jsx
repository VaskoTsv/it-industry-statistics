import React, { useContext } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { AuthContext } from './context/AuthContext.js';
import HomePage from './components/pages/HomePage.jsx';
import ComparerPage from './components/pages/ComparerPage.jsx';
import BookmarksPage from './components/pages/BookmarksPage.jsx';
import AuthPage from './components/pages/AuthPage.jsx';


export const AppRoutes = () => {
    const auth = useContext(AuthContext);
    const isAuthenticated = Boolean(auth.token);

    const renderAuthRoot = () => {
        return (
            <Route path='/auth' exact>
                <AuthPage />
            </Route>
        );
    }

    const renderBookmarksRoute = () => {
        return (
            <Route path="/bookmarked-companies">
                <BookmarksPage />
            </Route>
        );
    }

    return (
        <Switch>
            <Route path="/" exact>
                <HomePage />
            </Route>
            <Route path="/city-comparer" exact>
                <ComparerPage />
            </Route>
            {!isAuthenticated && renderAuthRoot()}
            {isAuthenticated && renderBookmarksRoute()}
            <Redirect to="/" />
        </Switch>
    );
}
