import React, { useContext, useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import { useHistory } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { Grid } from '@material-ui/core';
import ReactPlayer from 'react-player';
import { unauthAPIget } from '../utils/Helper';
import { StoreContext } from '../utils/store';
import useStyles from '../AppStyle';

function PlayGame() {
  const classes = useStyles();

  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const playerId = params.get('playerId');

  const { errorMsgContext } = useContext(StoreContext);
  const [, setErrorMsg] = errorMsgContext;
  const { successMsgContext } = useContext(StoreContext);
  const [, setSuccessMsg] = successMsgContext;

  const [gameStarted, setGameStarted] = useState(false);

  const [currQuestion, setCurrQuestion] = useState({});

  const [userAnswers, setUserAnswers] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);

  const [questionTimer, setQuestionTimer] = useState(-1);

  const [nextQuestion, setNextQuestion] = useState(false);

  // if nextQuestion is true, poll server for next question every second
  useEffect(() => {
    if (nextQuestion) {
      const id = setInterval(async () => {
        try {
          const r = await unauthAPIget(`play/${playerId}/question`, null, 'GET');
          if (r.question.question !== currQuestion.question) {
            setCurrQuestion(r.question);
            setQuestionTimer(r.question.timeLimit);
            setCorrectAnswers([]);
            setNextQuestion(false);
            setUserAnswers([]);

            r.question.answers.forEach((answer) => {
              setUserAnswers((prevState) => [
                ...prevState,
                {
                  correct: false,
                  id: answer.id,
                },
              ]);
            });
          }
        } catch (err) {
          if (err.message === 'Session ID is not an active session') {
            // game is over, last quesiton answered
            setNextQuestion(false);
            setGameStarted(false);
            history.push({ pathname: '/player-game-results', search: `?playerId=${playerId}` });
          } else {
            setErrorMsg(err.message);
          }
        }
      }, 500);
      return () => clearInterval(id);
    }
    return null;
  }, [currQuestion, history, nextQuestion, playerId, setErrorMsg]);

  // poll server every second to check if quiz has started
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const r = await unauthAPIget(`play/${playerId}/status`, null, 'GET');
        if (r.started) {
          clearInterval(id);
        }
        setGameStarted(r.started);
      } catch (err) {
        setErrorMsg(err.message);
      }
    }, 500);
  }, [playerId, setErrorMsg]);

  useEffect(() => {
    if (gameStarted) {
      setNextQuestion(true);
    }
  }, [playerId, setErrorMsg, gameStarted]);

  useEffect(() => {
    const timer = questionTimer > 0 && setInterval(() => setQuestionTimer(questionTimer - 1), 1000);

    const getCorrectAnswer = async () => {
      try {
        const r = await unauthAPIget(`play/${playerId}/answer`, null, 'GET');
        setCorrectAnswers(r.answerIds);
        // start polling for next question
        setNextQuestion(true);
      } catch (err) {
        setErrorMsg(err.message);
      }
    };

    if (questionTimer === 0) {
      // get result for question
      getCorrectAnswer();
    }

    return () => clearInterval(timer);
  }, [playerId, questionTimer, setErrorMsg]);

  // submit user answers
  const submitAnswers = async () => {
    try {
      const userAnswersArray = [];
      userAnswers.forEach((answer) => {
        if (answer.correct) {
          userAnswersArray.push(answer.id);
        }
      });

      const body = {
        answerIds: userAnswersArray,
      };

      await unauthAPIget(`play/${playerId}/answer`, body, 'PUT');
      setSuccessMsg('Answer Successfully submitted');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const updateUserAnswers = ((index) => {
    const answersCopy = [...userAnswers];
    // if single choice set all to false before setting new answer to true
    if (currQuestion.questionType === 'singleChoice') {
      answersCopy.forEach((answer, i) => {
        answersCopy[i].correct = false;
      });
    }
    // if only one answer is selected, prevent from that answer to setting false
    let selectedCount = 0;
    let selectedIndex = null;
    answersCopy.forEach((answer, i) => {
      if (answer.correct) {
        selectedCount += 1;
        selectedIndex = i;
      }
    });

    if (selectedCount === 1 && selectedIndex === index) {
      // user trying to unselect the only selected answer
      return;
    }

    const answerCopy = answersCopy[index];
    answerCopy.correct = !answerCopy.correct;
    answersCopy[index] = answerCopy;
    setUserAnswers(answersCopy);
    submitAnswers();
  });

  return (
    <>
      <Typography variant="h5">Playing Game</Typography>
      <Box my={1}>
        <Divider />
      </Box>
      {!gameStarted ? (
        <div>Waiting for game to start</div>
      ) : (
        currQuestion.answers && userAnswers.length === 6 && (
          <>
            <Box mb={3}>
              <Grid container justify="space-between" alignItems="flex-end">
                <Grid item>
                  <Typography variant="h6">{`Question ${currQuestion.id}: ${currQuestion.question} (${currQuestion.points} Points)` }</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6">{`Timer: ${questionTimer}`}</Typography>
                </Grid>
              </Grid>
            </Box>
            <Grid container spacing={5} direction="column" alignItems="center">
              <Grid item>
                {currQuestion.questionType === 'multipleChoice' ? (
                  <Typography variant="subtitle1">
                    Please select at least one answer
                  </Typography>
                ) : (
                  <Typography variant="subtitle1">
                    Please select only one answer
                  </Typography>
                )}
                <form>
                  <FormGroup>
                    <Grid container spacing={2}>
                      {currQuestion.answers.map((answer, index) => (
                        <>
                          {answer.answer !== ''
                  && (
                  <Grid item key={answer.id}>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={userAnswers[index].correct}
                          value={userAnswers[index].correct}
                          onChange={() => updateUserAnswers(index)}
                          color="primary"
                        />
                  )}
                      label={`Answer ${answer.id}`}
                    />
                  </Grid>
                  )}

                        </>
                      ))}
                    </Grid>
                  </FormGroup>
                </form>
                <Grid container spacing={2}>
                  {currQuestion.answers.map((answer, index) => (
                    <>
                      {answer.answer !== ''
                && (
                <Grid item>
                  <Card variant="outlined" className={classes.root}>
                    <CardActionArea
                      onClick={() => updateUserAnswers(index)}
                    >
                      <CardContent>
                        <Typography variant="body1">
                          {`Answer ${index + 1}: ${answer.answer}`}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
                )}

                    </>
                  ))}
                </Grid>
                {correctAnswers.length > 0
                && (
                <Box my={1}>
                  <Typography variant="h6">
                    Correct Answer(s):
                    {correctAnswers.map((answer, index) => (
                      index !== (correctAnswers.length - 1)
                        ? ` Answer ${answer},` : ` Answer ${answer}`

                    ))}
                  </Typography>
                </Box>
                )}
              </Grid>
              {currQuestion.questionResource === 'image' && currQuestion.questionImage !== undefined
              && (
                <Grid item>
                  <img className={classes.questionImage} alt={`Question ${currQuestion.id} resource`} src={currQuestion.questionImage} />
                </Grid>
              )}
              {currQuestion.questionResource === 'video' && currQuestion.questionVideo !== ''
              && (
              <Grid item className={classes.videoWrapper}>
                <ReactPlayer
                  className={classes.questionVideo}
                  controls
                  url={currQuestion.questionVideo}
                  width="100%"
                  height="100%"
                />
              </Grid>
              ) }
            </Grid>

          </>
        )
      )}
    </>
  );
}

export default PlayGame;
