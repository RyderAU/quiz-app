import React, { useContext, useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import { unauthAPIget } from '../utils/Helper';
import { StoreContext } from '../utils/store';

function Login({ setLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { errorMsgContext } = useContext(StoreContext);
  const [, setErrorMsg] = errorMsgContext;

  const history = useHistory();

  const loginUser = async () => {
    try {
      const body = {
        email,
        password,
      };
      const token = await unauthAPIget('admin/auth/login', body, 'POST');
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
    loginUser();
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
            <Typography variant="h5" aria-label="login title">Login</Typography>
          </Grid>
          <Grid item>
            <Divider />
          </Grid>

          <Grid item>
            <TextField
              required
              id="email-input"
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
              id="password-input"
              label="Password"
              aria-label="password"
              type="password"
              variant="filled"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid container justify="center" spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                aria-label="register"
                color="primary"
                name="registerButton"
                onClick={() => history.push('/register')}
              >
                register
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                type="submit"
                aria-label="login"
                color="primary"
                onSubmit={onSubmit}
              >
                login
              </Button>
            </Grid>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              aria-label="join a game"
              onClick={() => history.push('/join-game')}
            >
              Join a game
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}

Login.propTypes = {
  setLoggedIn: PropTypes.func.isRequired,
};

export default Login;
