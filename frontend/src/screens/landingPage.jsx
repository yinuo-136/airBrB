// This is the landing page, default will take client to dashboard(Listing screen), all routes are defined here.

import React, { useEffect } from 'react';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import RegPage from './RegPage';
import Topbar from '../components/Topbar';
import HostedListing from './HostedListing';
import ListingCreate from './ListingCreate';
import ListingEditPage from './ListingEdit';
import ListingPage from './ListingPage';
import {
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';

const LandingPage = () => {
  // clear the local storeage every time the landing page is reload.
  useEffect(() => {
    localStorage.clear();
  }, []);
  // set the token and email, at the start of the app they'll be null
  const [token, setToken] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [name, setName] = React.useState(null);
  const [listingInfo, setListingInfo] = React.useState(null);

  // set the navigation hook for SPA
  const navigate = useNavigate();

  // set a variable to trace the current path name
  const { pathname } = useLocation();

  // once the token changes after login or register, return to the dashboard
  React.useEffect(() => {
    if (token !== null) {
      if (pathname === '/login' || pathname === '/register') {
        navigate('/');
      }
    }
  }, [token]);

  // once the token changes after logout and if still in mylisting page, return to dashboard
  React.useEffect(() => {
    if (token === null) {
      if (pathname.includes('/hostedListing')) {
        navigate('/');
      }
    }
  }, [token]);

  return (
    <>
      <Topbar token={token} nav={navigate} setToken={setToken} setEmail={setEmail} pathname={pathname} name={name} setName={setName}/>

      <Routes>

      <Route path='/register' element={<RegPage nav={navigate} setToken={setToken} setEmail={setEmail} setName={setName}/>}>
      </Route>

      <Route path='/login' element={<LoginPage nav={navigate} setToken={setToken} setEmail={setEmail}/>}>
      </Route>

      <Route path='/' element={<Dashboard token={token} email={email} nav={navigate} setlistingInfo={setListingInfo}/>}>
      </Route>

      <Route path='/Listing/:id' element={<ListingPage nav={navigate} token={token} email={email} path={pathname} info={listingInfo}/>}>
      </Route>

      <Route path='/hostedListing' element={<HostedListing nav={navigate} token={token} email={email}/>}>
      </Route>

      <Route path='/hostedListing/:id' element={<ListingEditPage nav={navigate} path={pathname} token={token}/>}>
      </Route>

      <Route path='/hostedListing/createListing' element={<ListingCreate nav={navigate} token={token}/>}>
      </Route>

    </Routes>
    </>
  );
}

export default LandingPage;
