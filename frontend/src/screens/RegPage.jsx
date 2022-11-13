import React from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import { navTo, makeRequest } from '../helpers';
import { RegFormStyle } from '../styles/RegFormStyle';
import Form from 'react-bootstrap/Form';
import Alert from '@mui/material/Alert';

const RegPage = (props) => {
  const [name, setName] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [password, setPas] = React.useState(null);
  const [passwordConfirm, setPasCon] = React.useState(null);

  let isPasswordCorrect = false;
  if (password === passwordConfirm) {
    isPasswordCorrect = true;
  }

  const register = async () => {
    const data = await makeRequest('/user/auth/register', 'POST', {
      email, password, name
    })
    if (data) {
      props.setToken(data.token);
      props.setEmail(email);
      props.setName(name);
    }
  }

  return (
    <>
      <div><Button style={{ 'margin-left': 10 + 'px', 'margin-top': 10 + 'px' }} size='large' variant="contained" onClick= { () => { navTo(props.nav, '/') } } >Back</Button></div>
      <br />
      <br />
      <RegFormStyle>
      <Form>
    <div style={{ textAlign: 'center' }}><h4>Registration Form</h4></div>
    <br />

    <Form.Group className="mb-3" controlId="formBasicEmail">
      <Form.Label>Name</Form.Label>
      <Form.Control type="text" placeholder="Enter name" onChange={(event) => setName(event.target.value)} value={name}/>
    </Form.Group>
    <Form.Group className="mb-3" controlId="formBasicEmail">
      <Form.Label>Email address</Form.Label>
      <Form.Control type="text" placeholder="Enter email" onChange={(event) => setEmail(event.target.value)} value={email}/>
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" placeholder="Enter Password" onChange={(event) => setPas(event.target.value)} value={password}/>
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label>Confirm your Password</Form.Label>
      <Form.Control type="password" placeholder="Enter Password again" onChange={(event) => setPasCon(event.target.value)} value={passwordConfirm}/>
    </Form.Group>

    {!isPasswordCorrect &&
      <div style={{ textAlign: 'center' }}><Alert severity="warning" style={{ width: 100 + '%' }}>passwords are different</Alert>
      <Button variant="outlined" disabled style={{ 'margin-top': 10 + 'px' }}>Sign up</Button></div>
    }

    {isPasswordCorrect &&
      <div style={{ textAlign: 'center' }}><Alert severity="success">Password confirmed</Alert>
      <Button style={{ 'margin-top': 10 + 'px' }} variant="contained" onClick={register}>Sign up</Button></div>
    }
    </Form>
    </RegFormStyle>
    </>
  );
}

export default RegPage
RegPage.propTypes = {
  nav: PropTypes.func,
  setToken: PropTypes.func,
  setEmail: PropTypes.func,
  setName: PropTypes.func
}
