import React from 'react';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import PropTypes from 'prop-types';
import { DropzoneArea } from 'material-ui-dropzone';

function QuestionDetailsForm({
  answers, setAnswers, question, setQuestion,
  questionType, setQuestionType, points, setPoints, timeLimit, setTimeLimit,
  questionResource, setQuestionResource, questionVideo, setQuestionVideo,
  setQuestionImage,
}) {
  const updateCorrect = (index) => {
    const answersCopy = [...answers];
    const answerCopy = answersCopy[index];
    answerCopy.correct = !answerCopy.correct;
    answersCopy[index] = answerCopy;
    setAnswers(answersCopy);
  };

  const checkFilledAnswers = (index) => {
    for (let i = 0; i < index; i += 1) {
      if (answers[i].answer === '') {
        return false;
      }
    }
    return true;
  };

  const updateAnswer = (newAnswer, index) => {
    const answersCopy = [...answers];
    const answerCopy = answersCopy[index];
    answerCopy.answer = newAnswer;
    answersCopy[index] = answerCopy;
    setAnswers(answersCopy);
  };

  let correctAnswerError = true;
  for (let i = 0; i < answers.length; i += 1) {
    if (answers[i].correct === true) {
      correctAnswerError = false;
    }
  }

  return (
    <>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <FormControl component="fieldset" required>
            <FormLabel component="legend">Question Type</FormLabel>
            <RadioGroup
              row
              aria-label="question type"
              id="question-type"
              name="questionType"
              value={questionType}
              required
              onChange={(e) => setQuestionType(e.target.value)}
            >
              <FormControlLabel
                name="questionType"
                value="multipleChoice"
                control={<Radio color="primary" />}
                label="Multiple Choice"
                aria-label="multiple choice"
                labelPlacement="start"
              />
              <FormControlLabel
                name="questionType"
                value="singleChoice"
                control={<Radio color="primary" />}
                label="Single Choice"
                aria-label="single choice"
                labelPlacement="start"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item>
          <Grid container spacing={2}>
            <Grid item>
              <TextField
                required
                id="question-points-input"
                label="points"
                aria-label="points"
                value={points}
                type="number"
                variant="outlined"
                InputProps={{ inputProps: { min: 0 } }}
                onChange={(e) => {
                  setPoints(e.target.value);
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                required
                id="question-timelimit-input"
                label="Time Limit (seconds)"
                aria-label="time limit"
                type="number"
                variant="outlined"
                InputProps={{ inputProps: { min: 0 } }}
                value={timeLimit}
                onChange={(e) => {
                  setTimeLimit(e.target.value);
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <TextField
            required
            fullWidth
            id="question-input"
            label="question"
            aria-label="question"
            multiline
            rows="2"
            variant="outlined"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
          />
        </Grid>

        {answers.map((answer, index) => {
          // will only display if first two or all previous answers are not empty
          // or the current answer is not empty
          if (index < 2 || checkFilledAnswers(index) || (answer.answer !== '')) {
            return (
              <Grid item key={answer.id}>
                <TextField
                  fullWidth
                  required={index < 2}
                  label={`answer ${answer.id}`}
                  id="answer-input"
                  aria-label="answer"
                  multiline
                  variant="outlined"
                  value={answer.answer}
                  onChange={(e) => updateAnswer(e.target.value, index)}
                />
              </Grid>
            );
          }
          return <></>;
        })}

        <Grid item>
          <FormControl
            required
            component="fieldset"
            error={correctAnswerError}
          >
            <FormGroup>
              <Grid container spacing={2} alignItems="center" wrap="wrap">
                {answers.map((answer, index) => {
                  // will only display if first two or all previous answers are not empty
                  // or the current answer is not empty
                  if (index < 2 || checkFilledAnswers(index + 1) || (answer.answer !== '')) {
                    return (
                      <Grid item key={answer.id}>
                        <FormControlLabel
                          control={(
                            <Checkbox
                              checked={answer.correct}
                              // defaultChecked={answer.correct}
                              value={answer.correct}
                              onChange={() => updateCorrect(index)}
                              color="primary"
                            />
                                )}
                          label={`Correct (Answer ${index + 1})`}
                          aria-label="correct answer"
                        />
                      </Grid>
                    );
                  }
                  return <></>;
                })}
              </Grid>
            </FormGroup>
            <FormLabel component="legend">
              Select at least one correct answer
            </FormLabel>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl component="fieldset">
            <FormLabel component="legend">Additional Question Resource</FormLabel>
            <RadioGroup
              row
              aria-label="question resources"
              name="questionResources"
              value={questionResource}
              required
              onChange={(e) => setQuestionResource(e.target.value)}
            >
              <FormControlLabel
                id="video-submission"
                name="video resource"
                value="video"
                control={<Radio color="primary" />}
                label="Video resource"
                aria-label="video resource"
                labelPlacement="start"
              />
              <FormControlLabel
                id="image-submission"
                name="image resource"
                value="image"
                control={<Radio color="primary" />}
                label="Image resource"
                aria-label="image resource"
                labelPlacement="start"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        {questionResource !== ''
        && (
        <Grid item>

          { questionResource === 'video' ? (
            <TextField
              label="Youtube Video URL"
              aria-label="youtube video link"
              id="youtube-video-url"
              variant="outlined"
              onChange={(e) => {
                setQuestionVideo(e.target.value);
              }}
              value={questionVideo}
            />
          ) : (
            <>
              <FormLabel component="legend">Upload an image</FormLabel>
              <DropzoneArea
                acceptedFiles={['image/jpeg', 'image/png', 'image/jpg']}
                onChange={(files) => {
                  setQuestionImage(files[0]);
                }}
                label="image dropzone"
                aria-label="image dropzone"
                dropzoneText="Drag and drop an image here or click"
                filesLimit={1}
              />
            </>
          )}

        </Grid>
        )}
      </Grid>
    </>
  );
}

QuestionDetailsForm.propTypes = {
  answers: PropTypes.arrayOf(PropTypes.shape({
    correct: PropTypes.boolean,
    answer: PropTypes.string,
    id: PropTypes.number,
  })).isRequired,
  setAnswers: PropTypes.func.isRequired,
  question: PropTypes.string.isRequired,
  setQuestion: PropTypes.func.isRequired,
  questionType: PropTypes.string.isRequired,
  setQuestionType: PropTypes.func.isRequired,
  points: PropTypes.number.isRequired,
  setPoints: PropTypes.func.isRequired,
  timeLimit: PropTypes.number.isRequired,
  setTimeLimit: PropTypes.func.isRequired,
  questionResource: PropTypes.string.isRequired,
  setQuestionResource: PropTypes.func.isRequired,
  questionVideo: PropTypes.string.isRequired,
  setQuestionVideo: PropTypes.func.isRequired,
  setQuestionImage: PropTypes.func.isRequired,
};

export default QuestionDetailsForm;
