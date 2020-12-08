import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './AppRoutes.jsx';
import { AuthProvider } from './context/AuthContext.js';
import Navbar from './components/Navbar.jsx';
import { _StyledContentWrapper_ } from './components/styled-components/StyledApp.js';


function App() {
    return (
        <React.Fragment>
            <AuthProvider>

                <Router>
                    <Navbar />
                    <_StyledContentWrapper_>
                        <AppRoutes />
                    </_StyledContentWrapper_>
                </Router>

            </AuthProvider>
        </React.Fragment>
    );
}

export default App;
