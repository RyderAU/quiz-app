import React from 'react';
import Button from '@material-ui/core/Button';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

function GameStoppedAlert({ gameStopAlert, setGameStopAlert, sessionId }) {
  const history = useHistory();
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setGameStopAlert(false);
  };

  const onClick = (e) => {
    e.preventDefault();
    history.push({ pathname: '/admin-game-results', search: `?sessionId=${sessionId}` });
  };

  return (
    <>
      <Snackbar
        open={gameStopAlert}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="info">

          <Grid direction="column" container spacing={1} alignItems="center" justify="center">
            <Grid id="alert-msg" item>
              Game over - Would you like to view the results?
            </Grid>
            <Grid item>
              <Button
                onClick={onClick}
                variant="contained"
                color="secondary"
                id="view-results-button"
                aria-label="view results button"
              >
                Yes
              </Button>
            </Grid>
          </Grid>
        </Alert>
      </Snackbar>
    </>
  );
}

GameStoppedAlert.propTypes = {
  gameStopAlert: PropTypes.bool.isRequired,
  setGameStopAlert: PropTypes.func.isRequired,
  sessionId: PropTypes.number.isRequired,

};

export default GameStoppedAlert;
