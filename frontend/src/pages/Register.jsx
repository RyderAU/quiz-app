import React, { useState, useContext } from 'react';
import { TextField, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import { StoreContext } from '../utils/store';
import { unauthAPIget } from '../utils/Helper';

function Register({ setLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const { errorMsgContext } = useContext(StoreContext);
  const [, setErrorMsg] = errorMsgContext;

  const history = useHistory();

  const registerUser = async () => {
    try {
      const body = {
        email,
        password,
        name,
      };
      const token = await unauthAPIget('admin/auth/register', body, 'POST');
      window.localStorage.setItem('token', JSON.stringify(token));
      setErrorMsg('');
      history.push('/dashboard');
      setLoggedIn(true);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    registerUser();
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            <Typography variant="h5" aria-label="register title">Register</Typography>
          </Grid>
          <Grid item>
            <TextField
              required
              name="registerEmail"
              id="register-email-input"
              label="Email"
              aria-label="email"
              variant="filled"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              required
              name="registerPassword"
              id="register-password-input"
              label="Password"
              aria-label="password"
              type="password"
              variant="filled"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              required
              name="registerName"
              id="register-name-input"
              label="Name"
              aria-label="name"
              variant="filled"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid container justify="center" spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                aria-label="cancel registration"
                color="primary"
                onClick={() => {
                  history.push('/');
                }}
              >
                cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                type="submit"
                aria-label="register"
                color="primary"
                onSubmit={onSubmit}
              >
                register
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  );
}

Register.propTypes = {
  setLoggedIn: PropTypes.func.isRequired,
};

export default Register;
