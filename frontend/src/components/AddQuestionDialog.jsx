import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import QuestionDetailsForm from './QuestionDetailsForm';
import { authAPIget, fileToDataUrl } from '../utils/Helper';
import { StoreContext } from '../utils/store';

function AddQuestionDialog({
  gameid, open, setOpen, onFormSubmit,
}) {
  const { errorMsgContext } = useContext(StoreContext);
  const [, setErrorMsg] = errorMsgContext;
  const { successMsgContext } = useContext(StoreContext);
  const [, setSuccessMsg] = successMsgContext;

  const [answers, setAnswers] = useState([]);
  const [question, setQuestion] = useState('');
  const [questionType, setQuestionType] = useState('multipleChoice');
  const [points, setPoints] = useState(0);
  const [timeLimit, setTimeLimit] = useState(0);
  const [questionResource, setQuestionResource] = useState('video');
  const [questionVideo, setQuestionVideo] = useState('');
  const [questionImage, setQuestionImage] = useState();

  useEffect(() => {
    // set form values back to default
    const nAnswers = 6;
    setQuestion('');
    setAnswers([]);
    for (let i = 0; i < nAnswers; i += 1) {
      setAnswers((prevState) => [
        ...prevState,
        {
          answer: '',
          correct: false,
          id: i + 1,
        },
      ]);
    }
    setPoints();
    setTimeLimit();
    setQuestionVideo('');
    setQuestionImage();
    setQuestionResource('');
    setQuestionType('');
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (e) => {
    // adding question
    handleClose();
    e.preventDefault();
    try {
      const gameDetails = await authAPIget(`admin/quiz/${gameid}`, null, 'GET');
      const id = gameDetails.questions.length + 1;
      const newQuestion = {
        id,
        question,
        questionType,
        points,
        timeLimit,
        answers,
        questionResource,
        questionVideo,
        questionImage,
      };
      if (questionResource === 'image' && questionImage !== undefined) {
        // image selected
        fileToDataUrl(questionImage).then(async (questionImageURL) => {
          newQuestion.questionImage = questionImageURL;
          const body = {
            questions: [...gameDetails.questions, newQuestion],
            name: gameDetails.name,
            thumbnail: gameDetails.thumbnail,
          };
          await authAPIget(`admin/quiz/${gameid}`, body, 'PUT');
          onFormSubmit(id);
        });
      } else {
        const body = {
          questions: [...gameDetails.questions, newQuestion],
          name: gameDetails.name,
          thumbnail: gameDetails.thumbnail,
        };

        await authAPIget(`admin/quiz/${gameid}`, body, 'PUT');
        onFormSubmit(id);
      }

      setSuccessMsg('New question successfully added');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  let correctAnswerError = true;
  for (let i = 0; i < answers.length; i += 1) {
    if (answers[i].correct === true) {
      correctAnswerError = false;
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="md"
        fullWidth
        scroll="body"
      >
        <form onSubmit={onSubmit}>
          <DialogTitle>Add A New Question</DialogTitle>
          <DialogContent>
            <QuestionDetailsForm
              answers={answers}
              setAnswers={setAnswers}
              question={question}
              setQuestion={setQuestion}
              questionType={questionType}
              setQuestionType={setQuestionType}
              points={points}
              setPoints={setPoints}
              timeLimit={timeLimit}
              setTimeLimit={setTimeLimit}
              questionResource={questionResource}
              setQuestionResource={setQuestionResource}
              questionVideo={questionVideo}
              setQuestionVideo={setQuestionVideo}
              setQuestionImage={setQuestionImage}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              color="primary"
              aria-label="cancel"
            >
              Cancel
            </Button>
            <Button
              disabled={correctAnswerError}
              type="submit"
              onSubmit={onSubmit}
              color="primary"
              aria-label="add"
            >
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

AddQuestionDialog.propTypes = {
  gameid: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
};

export default AddQuestionDialog;
