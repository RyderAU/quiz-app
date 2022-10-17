import React, { useState, useEffect, useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import QuestionDetailsForm from '../components/QuestionDetailsForm';
import { StoreContext } from '../utils/store';
import { authAPIget } from '../utils/Helper';

function EditQuestion() {
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const gameid = params.get('gameid');
  const questionid = params.get('questionid');

  const [answers, setAnswers] = useState([]);
  const [question, setQuestion] = useState('');
  const [questionType, setQuestionType] = useState('multipleChoice');
  const [points, setPoints] = useState(0);
  const [timeLimit, setTimeLimit] = useState(0);
  const [questionResource, setQuestionResource] = useState('video');
  const [questionVideo, setQuestionVideo] = useState('');
  const [questionImage, setQuestionImage] = useState();

  const { errorMsgContext } = useContext(StoreContext);
  const [, setErrorMsg] = errorMsgContext;
  const { successMsgContext } = useContext(StoreContext);
  const [, setSuccessMsg] = successMsgContext;

  const [gameDetails, setGameDetails] = useState({});

  useEffect(() => {
    const initialGetGameDetails = async () => {
      try {
        const currentDetails = await authAPIget(`admin/quiz/${gameid}`, null, 'GET');
        setErrorMsg('');
        setGameDetails(currentDetails);
        const currentQuestions = currentDetails.questions;
        const currentQuestion = currentQuestions.find((q) => (q.id === parseInt(questionid, 10)));

        // set initial details of question
        setAnswers(currentQuestion.answers);
        setQuestion(currentQuestion.question);
        setQuestionType(currentQuestion.questionType);
        setPoints(currentQuestion.points);
        setTimeLimit(currentQuestion.timeLimit);
        setQuestionResource(currentQuestion.questionResource);
        setQuestionVideo(currentQuestion.questionVideo);
        setQuestionImage(currentQuestion.questionImage);
      } catch (err) {
        setErrorMsg(err.message);
      }
    };
    initialGetGameDetails();
  }, [gameid, setErrorMsg, questionid]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const questionsCopy = gameDetails.questions;
      questionsCopy.forEach((q, index) => {
        if (q.id === parseInt(questionid, 10)) {
          questionsCopy[index].answers = answers;
          questionsCopy[index].question = question;
          questionsCopy[index].questionType = questionType;
          questionsCopy[index].points = points;
          questionsCopy[index].timeLimit = timeLimit;
          questionsCopy[index].questionResource = questionResource;
          questionsCopy[index].questionVideo = questionVideo;
          questionsCopy[index].questionImage = questionImage;
        }
      });
      const body = {
        name: gameDetails.name,
        thumbnail: gameDetails.thumbnail,
        questions: questionsCopy,
      };
      await authAPIget(`admin/quiz/${gameid}`, body, 'PUT');
      history.push({ pathname: '/edit-game', search: `?gameid=${gameid}` });
      setSuccessMsg('Question successfully updated');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <>
      <Grid container justify="space-between" alignItems="flex-end">
        <Grid item>
          <Typography variant="h5">Editing Question </Typography>
        </Grid>
      </Grid>
      <Box my={1}>
        <Divider />
      </Box>
      {
          gameDetails !== undefined && (
            <form onSubmit={onSubmit}>
              <Grid container direction="column" spacing={2}>
                <Grid item>
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
                    aria-label="question details form"
                  />
                </Grid>
                <Grid item>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="secondary"
                        aria-label="cancel update question details"
                        onClick={() => {
                          history.push({ pathname: '/edit-game', search: `?gameid=${gameid}` });
                        }}
                      >
                        cancel
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="secondary"
                        type="submit"
                        aria-label="update question details"
                        onSubmit={onSubmit}
                      >
                        Update
                      </Button>
                    </Grid>
                  </Grid>

                </Grid>
              </Grid>
            </form>
          )
        }
    </>
  );
}

export default EditQuestion;
