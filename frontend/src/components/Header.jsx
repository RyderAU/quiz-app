import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import { Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { authAPIget } from '../utils/Helper';
import { StoreContext } from '../utils/store';
import useStyles from '../AppStyle';

function Header({ loggedIn, setLoggedIn }) {
  const classes = useStyles();
  const history = useHistory();
  const { errorMsgContext } = useContext(StoreContext);
  const [, setErrorMsg] = errorMsgContext;

  const logout = async () => {
    try {
      await authAPIget('admin/auth/logout', null, 'POST');
      setLoggedIn(false);
      history.push('/');
      window.localStorage.removeItem('token');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" aria-label="big brain website title">Big Brain</Typography>
          </Grid>
          {loggedIn && (
            <Grid item>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <IconButton
                    onClick={() => {
                      history.push('/dashboard');
                    }}
                    aria-label="home page"
                    className={classes.homeIconWrapper}
                  >
                    <HomeIcon
                      className={classes.largeIcon}
                      color="secondary"
                    />
                  </IconButton>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    aria-label="logout"
                    onClick={logout}
                    id="logout-button"
                  >
                    Logout
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  setLoggedIn: PropTypes.func.isRequired,
};

export default Header;
