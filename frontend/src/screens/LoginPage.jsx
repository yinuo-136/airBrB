import React from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import { navTo, makeRequest } from '../helpers';
import { RegFormStyle } from '../styles/RegFormStyle';
import Form from 'react-bootstrap/Form';

const LoginPage = (props) => {
  // trace the email and password
  const [email, setEmail] = React.useState(null);
  const [password, setPas] = React.useState(null);

  // send server login request
  const login = async () => {
    const data = await makeRequest('/user/auth/login', 'POST', {
      email, password
    })
    if (data) {
      props.setToken(data.token);
      props.setEmail(email);
    }
  }

  return (
    <>
      <div><Button style={{ 'margin-left': 10 + 'px', 'margin-top': 10 + 'px' }} size='large' variant="contained" onClick= { () => { navTo(props.nav, '/') } } >Back</Button></div>
      <br />
      <br />

      {/* the form used for register */}
      <RegFormStyle>
      <Form>
        <div style={{ textAlign: 'center' }}><h4>Login Form</h4></div>
        <br />

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="text" placeholder="Enter email" onChange={(event) => setEmail(event.target.value)} value={email}/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter Password" onChange={(event) => setPas(event.target.value)} value={password}/>
        </Form.Group>

        <div style={{ textAlign: 'center' }}>
          <Button name="submitloginButton" style={{ 'margin-top': 10 + 'px' }} variant="contained" onClick={login}>Log in</Button>
        </div>
      </Form>
      </RegFormStyle>
    </>
  );
}

export default LoginPage

// use for lining purpose
LoginPage.propTypes = {
  nav: PropTypes.func,
  name: PropTypes.string,
  setToken: PropTypes.func,
  setEmail: PropTypes.func
}
