import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { StoreContext } from '../utils/store';
import QuestionCard from '../components/QuestionCard';
import { authAPIget, fileToDataUrl } from '../utils/Helper';
import AddQuestionDialog from '../components/AddQuestionDialog';
import EditGameDialog from '../components/EditGameDialog';

function EditGame() {
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const gameid = params.get('gameid');

  const { errorMsgContext } = useContext(StoreContext);
  const [, setErrorMsg] = errorMsgContext;
  const { successMsgContext } = useContext(StoreContext);
  const [, setSuccessMsg] = successMsgContext;

  const [gameDetails, setGameDetails] = useState({});

  const [questionIDs, setQuestionIDs] = useState([]);

  const [addQuestionDialogOpen, setAddQuestionDialogOpen] = useState(false);
  const [editGameDialogOpen, setEditGameDialogOpen] = useState(false);

  useEffect(() => {
    const initialGetGameDetails = async () => {
      try {
        const r = await authAPIget(`admin/quiz/${gameid}`, null, 'GET');
        setErrorMsg('');
        setQuestionIDs([]);
        setGameDetails(r);
        r.questions.forEach((question) => {
          setQuestionIDs((prevState) => [...prevState, question.id]);
        });
      } catch (err) {
        setErrorMsg(err.message);
      }
    };
    initialGetGameDetails();
  }, [gameid, setErrorMsg]);

  useEffect(() => {
    const getGameDetails = async () => {
      try {
        const r = await authAPIget(`admin/quiz/${gameid}`, null, 'GET');
        setErrorMsg('');
        setGameDetails(r);
      } catch (err) {
        setErrorMsg(err.message);
      }
    };
    getGameDetails();
  }, [gameid, setErrorMsg, questionIDs]);

  const addToDOM = (questionid) => {
    setQuestionIDs([...questionIDs, questionid]);
  };

  const deleteQuestion = async (questionid) => {
    try {
      let { questions } = gameDetails;
      // delete from questions array
      questions = questions.filter((question) => (question.id !== questionid));
      const body = {
        questions,
      };
      await authAPIget(`admin/quiz/${gameid}`, body, 'PUT');
      let questionIDsCopy = [...questionIDs];
      questionIDsCopy = questionIDsCopy.filter((id) => (id !== questionid));
      setQuestionIDs(questionIDsCopy);

      setErrorMsg('');
      setSuccessMsg('Question successfully deleted');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const editGameDetails = async (newGameName, newGameThumbnail) => {
    try {
      const body = {
        name: gameDetails.name,
        thumbnail: gameDetails.thumbnail,
        questions: gameDetails.questions,
      };

      if (newGameName !== '') {
        body.name = newGameName;
      }

      if (newGameThumbnail !== undefined) {
        fileToDataUrl(newGameThumbnail).then(async (thumbnail) => {
          body.thumbnail = thumbnail;
          await authAPIget(`admin/quiz/${gameid}`, body, 'PUT');
          setQuestionIDs([...questionIDs]);
        });
      } else {
        await authAPIget(`admin/quiz/${gameid}`, body, 'PUT');
        setQuestionIDs([...questionIDs]);
      }
      setSuccessMsg('Successfully editied game details');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <>
      <Grid container justify="space-between" alignItems="flex-end">
        <Grid item>
          <Typography id="edit-game-title" variant="h5">{`Editing Game: ${gameDetails.name}`}</Typography>
        </Grid>
        <Grid item>
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                aria-label="edit game details"
                onClick={() => {
                  setEditGameDialogOpen(true);
                }}
              >
                Edit Game Details
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                aria-label="add question to game"
                onClick={() => {
                  setAddQuestionDialogOpen(true);
                }}
              >
                Add Question
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box my={1}>
        <Divider />
      </Box>
      <AddQuestionDialog
        gameid={gameid}
        open={addQuestionDialogOpen}
        setOpen={setAddQuestionDialogOpen}
        onFormSubmit={addToDOM}
      />
      <EditGameDialog
        open={editGameDialogOpen}
        setOpen={setEditGameDialogOpen}
        onFormSubmit={editGameDetails}
      />
      <Grid container spacing={3} direction="column">
        {questionIDs.map((questionid, index) => (
          <Grid key={Math.random()} item xs={12}>
            <QuestionCard
              gameid={gameid}
              questionid={questionid}
              deleteQuestion={deleteQuestion}
              question={gameDetails.questions[index]}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default EditGame;
