import React, { useContext, useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import { unauthAPIget } from '../utils/Helper';
import { StoreContext } from '../utils/store';

function JoinGame() {
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);

  const [sessionID, setSessionID] = useState(params.get('id'));
  const [name, setName] = useState('');

  const { errorMsgContext } = useContext(StoreContext);
  const [, setErrorMsg] = errorMsgContext;
  const { successMsgContext } = useContext(StoreContext);
  const [, setSuccessMsg] = successMsgContext;

  const joinGame = async () => {
    try {
      const body = {
        name,
      };
      const playerId = await unauthAPIget(
        `play/join/${sessionID}`,
        body,
        'POST',
      );
      history.push({ pathname: '/play-game', search: `?playerId=${playerId.playerId}` });
      setSuccessMsg('Game successfully joined');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    joinGame();
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
            <Typography variant="h5" aria-label="join game title">Join a Game</Typography>
          </Grid>
          <Grid item>
            <TextField
              required
              id="sessionid-input"
              label="Session ID"
              aria-label="session ID"
              variant="filled"
              value={sessionID}
              onChange={(e) => setSessionID(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              required
              id="name-input"
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
                type="submit"
                color="primary"
                aria-label="cancel"
                onClick={() => history.push('/')}
              >
                cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                type="submit"
                color="primary"
                aria-label="join"
                onSubmit={onSubmit}
              >
                Join
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  );
}

export default JoinGame;
