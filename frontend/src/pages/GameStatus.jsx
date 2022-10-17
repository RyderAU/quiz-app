import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import { StoreContext } from '../utils/store';
import { authAPIget } from '../utils/Helper';
import GameStoppedAlert from '../components/GameStoppedAlert';

function GameStatus() {
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const gameid = params.get('gameid');
  const sessionid = params.get('sessionid');

  const [stage, setStage] = useState(-1);

  const [players, setPlayers] = useState([]);

  const { errorMsgContext } = useContext(StoreContext);
  const [, setErrorMsg] = errorMsgContext;

  const [gameStopAlert, setGameStopAlert] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [questionTimer, setQuestionTimer] = useState(-1);

  const [gameDetails, setGameDetails] = useState({});

  useEffect(() => {
    const getGameDetails = async () => {
      try {
        const r = await authAPIget(`admin/quiz/${gameid}`, null, 'GET');
        setGameDetails(r);
      } catch (err) {
        setErrorMsg(err.message);
      }
    };

    getGameDetails();
  }, [gameid, setErrorMsg]);

  useEffect(() => {
    const getGameDetails = async () => {
      try {
        const r = await authAPIget(`admin/quiz/${gameid}`, null, 'GET');
        setGameDetails(r);
      } catch (err) {
        setErrorMsg(err.message);
      }
    };

    getGameDetails();
  }, [gameid, setErrorMsg]);

  // poll server until game starts in order to live feed of players
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const r = await authAPIget(`admin/session/${sessionid}/status`, null, 'GET');
        setPlayers(r.results.players);
        if (r.results.position > -1 || r.results.active === false) {
          clearInterval(id);
        }
      } catch (err) {
        setErrorMsg(err.message);
      }
    }, 1000);
  }, [sessionid, setErrorMsg]);

  const advanceGame = async (e) => {
    e.preventDefault();
    try {
      const r = await authAPIget(`admin/quiz/${gameid}/advance`, null, 'POST');
      setStage((s) => s + 1);
      if (r.stage === gameDetails.questions.length) {
        setGameStopAlert(true);
        setGameOver(true);
      } else {
        setQuestionTimer(gameDetails.questions[r.stage].timeLimit);
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  useEffect(() => {
    // following line of code from https://dev.to/zhiyueyi/how-to-create-a-simple-react-countdown-timer-4mc3
    const timer = questionTimer > 0 && setInterval(() => setQuestionTimer(questionTimer - 1), 1000);
    return () => clearInterval(timer);
  }, [questionTimer]);

  return (
    <>
      <Grid container justify="space-between" alignItems="flex-end">
        <Grid item>
          <Typography variant="h5">{`Game Status: ${gameDetails.name}`}</Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={advanceGame}
            disabled={gameOver}
          >
            Advance
          </Button>
        </Grid>
      </Grid>
      <Box my={1}>
        <Divider />
      </Box>
      <Typography variant="subtitle1">{`Session ID: ${sessionid}`}</Typography>
      {gameDetails.questions !== undefined
        && (
          <>
            <Typography variant="subtitle1">{`Number of questions: ${gameDetails.questions.length}`}</Typography>
            <Typography variant="subtitle1">{`Current Players: ${players.join(', ')}`}</Typography>
            { stage === -1
          && <Typography variant="subtitle1">Current Status: Waiting for game to start</Typography>}
            {stage >= 0 && stage < gameDetails.questions.length
          && (
            <>
              <Typography variant="subtitle1">{`Current Status: Question ${stage + 1} - ${gameDetails.questions[stage].question}` }</Typography>
              <Typography variant="subtitle1">{`Question timer: ${questionTimer}` }</Typography>
            </>
          )}
            {stage === gameDetails.questions.length
          && (<Typography variant="subtitle1">Current Status: Game Over</Typography>)}
          </>
        )}
      <GameStoppedAlert
        gameStopAlert={gameStopAlert}
        setGameStopAlert={setGameStopAlert}
        sessionId={sessionid}
      />
    </>

  );
}

export default GameStatus;
