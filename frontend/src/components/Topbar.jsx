// this is the top bar that will always show on the top of the app

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import { makeRequest } from '../helpers';
import Stack from '@mui/material/Stack';

// This will render the info bar at the top of the page and will contain serveral buttons and information(e.g login logout)
const Topbar = (props) => {
  // navigate to login route
  const showLogin = () => {
    props.nav('/login');
  }

  // navigate to register route
  const showReg = () => {
    props.nav('/register');
  }

  // navigate to hostedListing route
  const showMyListings = () => {
    props.nav('/hostedListing');
  }

  // navigate to landing page
  const showDashboard = () => {
    props.nav('/');
  }

  // send server logout request
  const logout = async () => {
    const data = await makeRequest('/user/auth/logout', 'POST', {}, props.token);
    if (Object.keys(data).length === 0) {
      props.setEmail(null);
      props.setToken(null);
      props.setName(null);
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
        {!props.name &&
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          AirBrB
        </Typography>
        }

        {props.name &&
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Welcome, {props.name}
        </Typography>
        }

        {/* if user not login/registerd, show reg and login button */}
        {!props.token &&
          <><Button size="large" color="inherit" onClick={showReg}>Register</Button>
          <Button size="large" color="inherit" onClick={showLogin}>Login</Button></>
        }

        {/* if user has login/registerd, show user listing page button */}
        {props.token &&
           <Stack spacing={2} direction="row">
            {props.pathname === '/' &&
              <Button size="large" color="inherit" onClick={showMyListings}>Mylistings</Button>
            }
            {props.pathname.includes('/hostedListing') &&
              <Button size="large" color="inherit" onClick={showDashboard}>Dashboard</Button>
            }
            <Button size="large" color="inherit" onClick={logout}>Log out</Button>
            </Stack>
        }
      </Toolbar>
    </AppBar>
  </Box>
  );
}

export default Topbar

// write for linting purpose
Topbar.propTypes = {
  name: PropTypes.string,
  token: PropTypes.string,
  nav: PropTypes.func,
  setToken: PropTypes.func,
  pathname: PropTypes.string,
  setEmail: PropTypes.func,
  setName: PropTypes.func
}
