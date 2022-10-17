import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import useStyles from '../AppStyle';

export default function QuestionCard({
  gameid, questionid, deleteQuestion, question,
}) {
  const classes = useStyles();
  const history = useHistory();

  const editQuestion = (e) => {
    e.preventDefault();
    history.push({ pathname: '/edit-question', search: `?gameid=${gameid}&questionid=${questionid}` });
  };

  return (
    question !== undefined && (
      <>
        <Card className={classes.root}>
          <CardContent>
            <Typography variant="h6">{`Question ${question.id}: ${question.question}`}</Typography>

            <Grid container spacing={5}>
              <Grid item>
                <Typography variant="body1" color="textSecondary" component="p">
                  {`- Question Type: ${question.questionType}`}
                </Typography>
                <Typography variant="body1" color="textSecondary" component="p">
                  {`- Points: ${question.points}`}
                </Typography>
                <Typography variant="body1" color="textSecondary" component="p">
                  {`- Time Limit: ${question.timeLimit} seconds`}
                </Typography>
                {question.answers.map((answer) => (
                  answer.answer !== ''
                    && (
                    <>
                      {answer.correct ? (
                        <Typography key={Math.random()} variant="body1" color="textSecondary" component="p">
                          {`- Answer ${answer.id} (correct): ${answer.answer}`}
                        </Typography>
                      ) : (
                        <Typography key={Math.random()} variant="body1" color="textSecondary" component="p">
                          {`- Answer ${answer.id} (incorrect): ${answer.answer}`}
                        </Typography>
                      )}

                    </>
                    )
                ))}
                {question.questionImage === undefined && question.questionVideo === ''
              && (
                <Typography variant="body1" color="textSecondary" component="p">
                  - Additional Resource: n/a
                </Typography>
              )}
              </Grid>
              <Grid item>
                {question.questionResource === 'video' && question.questionVideo !== ''
              && (
                <Typography variant="body1" color="textSecondary" component="p">
                  {`- Additional Resource (Video): ${question.questionVideo}`}
                </Typography>
              )}

                {question.questionResource === 'image' && question.questionImage !== undefined
              && (
                <>
                  <Typography variant="body1" color="textSecondary" component="p">
                    {'- Additional Resource (Image): '}
                  </Typography>
                  <img className={classes.questionImage} alt="visual medium corresponding to question" src={question.questionImage} />
                </>
              )}
              </Grid>
            </Grid>
          </CardContent>
          <Divider variant="middle" />
          <CardActions>
            <Button
              variant="outlined"
              aria-label="edit question"
              onClick={editQuestion}
              color="secondary"
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
            <IconButton
              aria-label="delete game"
              onClick={(e) => {
                e.preventDefault();
                deleteQuestion(questionid);
              }}
              color="secondary"
            >
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
      </>
    )
  );
}

QuestionCard.propTypes = {
  gameid: PropTypes.string.isRequired,
  questionid: PropTypes.number.isRequired,
  deleteQuestion: PropTypes.func.isRequired,
  question: PropTypes.shape({
    id: PropTypes.number,
    question: PropTypes.string,
    questionType: PropTypes.string,
    points: PropTypes.number,
    timeLimit: PropTypes.number,
    questionResource: PropTypes.string,
    questionVideo: PropTypes.string,
    questionImage: PropTypes.string,
    answers: PropTypes.arrayOf(PropTypes.shape({
      correct: PropTypes.boolean,
      answer: PropTypes.string,
      id: PropTypes.number,
    })),
  }).isRequired,
};
