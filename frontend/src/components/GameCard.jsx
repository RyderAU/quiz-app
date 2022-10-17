import React, { useState, useEffect, useContext } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import EditIcon from '@material-ui/icons/Edit';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { authAPIget } from '../utils/Helper';
import { StoreContext } from '../utils/store';
import GameStoppedAlert from './GameStoppedAlert';
import useStyles from '../AppStyle';

export default function GameCard({ gameid, gameIDs, setGameIDs }) {
  const classes = useStyles();
  const { errorMsgContext } = useContext(StoreContext);
  const [, setErrorMsg] = errorMsgContext;
  const { successMsgContext } = useContext(StoreContext);
  const [, setSuccessMsg] = successMsgContext;
  const [gameDetails, setGameDetails] = useState({});
  const [estimatedTime, setEstimatedTime] = useState(0);

  const [gameStartMsg, setGameStartMsg] = useState('');
  const [gameStartAlert, setGameStartAlert] = useState(false);
  const [gameStopAlert, setGameStopAlert] = useState(false);
  const history = useHistory();

  const [prevSessionId, setPrevSessionId] = useState(0);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setGameStartAlert(false);
  };

  useEffect(() => {
    const getGameDetails = async () => {
      try {
        const r = await authAPIget(`admin/quiz/${gameid}`, null, 'GET');
        setGameDetails(r);
        // get estimated time for game
        let currTime = 0;
        r.questions.forEach((question) => {
          currTime += parseInt(question.timeLimit, 10);
        });
        setEstimatedTime(currTime);
      } catch (err) {
        setErrorMsg(err.message);
      }
    };

    getGameDetails();
  }, [gameid, setErrorMsg, gameIDs]);

  const deleteGame = async (e) => {
    e.preventDefault();
    try {
      await authAPIget(`admin/quiz/${gameid}`, null, 'DELETE');
      let gameIDsCopy = [...gameIDs];

      gameIDsCopy = gameIDsCopy.filter((id) => (id !== gameid));
      setGameIDs(gameIDsCopy);

      setErrorMsg('');
      setSuccessMsg(`Game (${gameDetails.name}) successfully deleted`);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const editGame = (e) => {
    e.preventDefault();
    history.push({ pathname: '/edit-game', search: `?gameid=${gameid}` });
  };

  const startGame = async (e) => {
    e.preventDefault();
    try {
      await authAPIget(`admin/quiz/${gameid}/start`, null, 'POST');
      const r = await authAPIget(`admin/quiz/${gameid}`, null, 'GET');
      setGameDetails(r);
      setGameStartMsg(`Game started with session ID - ${r.active}`);
      setGameStartAlert(true);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const stopGame = async (e) => {
    e.preventDefault();
    try {
      setPrevSessionId(gameDetails.active);
      await authAPIget(`admin/quiz/${gameid}/end`, null, 'POST');
      setGameStopAlert(true);
      // re-render component
      setGameIDs([...gameIDs]);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const copySessionId = () => {
    navigator.clipboard.writeText(`${window.location.origin}/join-game?id=${gameDetails.active}`);
    handleClose();
  };

  return (
    <>
      {gameDetails.questions !== undefined && (
        <Card className={classes.root}>
          {gameDetails.thumbnail !== null && (
            <CardMedia
              className={classes.media}
              image={gameDetails.thumbnail}
              aria-label="game thumbnail"
              title="game thumbnail"
            />
          )}
          <CardContent>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h6">{gameDetails.name}</Typography>
              </Grid>
              <Grid item>
                <IconButton
                  aria-label="delete game"
                  onClick={deleteGame}
                  color="secondary"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Typography variant="body1" color="textSecondary" component="p">
              {`- ${gameDetails.questions.length} questions`}
            </Typography>
            <Typography variant="body1" color="textSecondary" component="p">
              {`- Estimated time: ${estimatedTime} seconds`}
            </Typography>
            <Typography variant="body1" color="textSecondary" component="p">
              {`- Number of previous sessions: ${gameDetails.oldSessions.length}`}
            </Typography>
          </CardContent>
          <Divider variant="middle" />
          <CardActions>
            <Button
              size="small"
              variant="outlined"
              aria-label="edit game"
              onClick={editGame}
              color="secondary"
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
            {gameDetails.active === null ? (
              <Button id="start-game-button" size="small" color="secondary" variant="outlined" aria-label="start game" onClick={startGame}>
                Start
              </Button>
            ) : (
              <>
                <Button id="stop-game-button" size="small" color="secondary" variant="outlined" aria-label="stop game" onClick={stopGame}>
                  Stop
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  variant="outlined"
                  aria-label="game status"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push({ pathname: '/game-status', search: `?gameid=${gameid}&sessionid=${gameDetails.active}` });
                  }}
                >
                  Status
                </Button>
              </>
            )}

          </CardActions>
        </Card>
      )}
      <Snackbar
        open={gameStartAlert}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="info">
          <Grid direction="column" container spacing={1} alignItems="center" justify="center">
            <Grid item>
              {gameStartMsg}
            </Grid>
            <Grid item>
              <Button
                onClick={copySessionId}
                variant="contained"
                color="secondary"
                aria-label="copy link"
              >
                Copy Link
              </Button>
            </Grid>
          </Grid>
        </Alert>
      </Snackbar>
      {gameDetails.questions !== undefined && (
      <GameStoppedAlert
        gameStopAlert={gameStopAlert}
        setGameStopAlert={setGameStopAlert}
        sessionId={prevSessionId}
      />
      )}
    </>
  );
}

GameCard.propTypes = {
  gameid: PropTypes.number.isRequired,
  gameIDs: PropTypes.arrayOf(PropTypes.number).isRequired,
  setGameIDs: PropTypes.func.isRequired,
};
