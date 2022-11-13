import React from 'react';
import './App.css';
import LandingPage from './screens/landingPage';
import {
  BrowserRouter as Router,
} from 'react-router-dom';

function App () {
  // because of the need to use react router, everything is wrapped in landingPage.
  return (
    <Router>
      <LandingPage />
    </Router>
  );
}

export default App;
