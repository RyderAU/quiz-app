import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { StoreContext } from '../utils/store';
import { authAPIget } from '../utils/Helper';
import useStyles from '../AppStyle';

function UploadGameDialog({
  open, setOpen, gameIDs, setGameIDs,
}) {
  const classes = useStyles();

  const { errorMsgContext } = useContext(StoreContext);
  const [, setErrorMsg] = errorMsgContext;
  const { successMsgContext } = useContext(StoreContext);
  const [, setSuccessMsg] = successMsgContext;

  const [gameData, setGameData] = useState();

  const handleClose = () => {
    setOpen(false);
  };
  const checkValid = (uploadedFile) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      try {
        setGameData(JSON.parse(fileReader.result));
      } catch (e) {
        setErrorMsg('Invalid JSON file');
        handleClose();
        setGameData(undefined);
      }
    };
    if (uploadedFile !== undefined) fileReader.readAsText(uploadedFile);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    handleClose();
    // create game with uploaded data
    if (gameData !== undefined) {
      try {
        let body = {
          name: gameData.name,
        };
        const gameID = await authAPIget('admin/quiz/new', body, 'POST');

        let gameThumbnail = null;
        if (gameData.thumbnail !== null) {
          gameThumbnail = `data:image/${gameData.thumbnailType};base64,${gameData.thumbnail}`;
        }
        const gameQuestions = gameData.questions;
        gameQuestions.forEach((question, questionIndex) => {
          gameQuestions[questionIndex].id = questionIndex + 1;
          gameQuestions[questionIndex].answers.forEach((answer, answerIndex) => {
            gameQuestions[questionIndex].answers[answerIndex].id = answerIndex + 1;
          });
          if (question.questionImage !== '') {
            gameQuestions[questionIndex].questionImage = `data:image/${question.questionImageType};base64,${question.questionImage}`;
          }
        });

        body = {
          thumbnail: gameThumbnail,
          questions: gameQuestions,
        };
        await authAPIget(`admin/quiz/${gameID.quizId}`, body, 'PUT');

        setGameIDs([...gameIDs, gameID.quizId]);
        setSuccessMsg(`Game (${gameData.name}) successfully created from JSON file upload`);
        setGameData(undefined);
      } catch (err) {
        setErrorMsg(err.message);
        setGameData(undefined);
      }
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={onSubmit}>
          <DialogTitle>Upload a JSON file with game details</DialogTitle>
          <DialogContent>
            <Button
              htmlFor="JSONupload"
              component="label"
              variant="contained"
              color="primary"
            >
              Upload JSON file
            </Button>
            <input
              className={classes.hidden}
              id="JSONupload"
              type="file"
              aria-label="choose file"
              onChange={(e) => checkValid(e.target.files[0])}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" aria-label="cancel upload">
              Cancel
            </Button>
            <Button type="submit" onSubmit={onSubmit} color="primary" aria-label="upload game">
              Upload
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

UploadGameDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  gameIDs: PropTypes.arrayOf(PropTypes.number).isRequired,
  setGameIDs: PropTypes.func.isRequired,
};

export default UploadGameDialog;
