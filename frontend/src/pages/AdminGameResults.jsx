import React, { useContext, useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import { useHistory } from 'react-router-dom';
import { Chart } from 'react-google-charts';
import { authAPIget } from '../utils/Helper';
import { StoreContext } from '../utils/store';

function AdminGameResults() {
  const [results, setResults] = useState([]);

  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const sessionId = params.get('sessionId');
  const [playerScoresSorted, setPlayerScoresSorted] = useState([]);

  const [gameQuestions, setGameQuestions] = useState([]);

  const [questionAnswersData, setQuestionAnswersData] = useState([]);
  const [questionTimeData, setQuestionTimeData] = useState([]);
  const [averagePoints, setAveragePoints] = useState(0);

  const { errorMsgContext } = useContext(StoreContext);
  const [, setErrorMsg] = errorMsgContext;

  useEffect(() => {
    const getResults = async () => {
      try {
        const r = await authAPIget(`admin/session/${sessionId}/results`, null, 'GET');
        setResults(r.results);
      } catch (err) {
        setErrorMsg(err.message);
      }
    };
    getResults();
  }, [sessionId, setErrorMsg]);

  useEffect(() => {
    // calulate points of each player
    const calculateTopPlayers = async () => {
      try {
        const r = await authAPIget(`admin/session/${sessionId}/status`, null, 'GET');
        const { questions } = r.results;
        setGameQuestions(r.results.questions);
        const questionPointsDict = {};
        questions.forEach((question) => {
          questionPointsDict[question.id] = question.points;
        });
        const playerScores = [];
        let totalPoints = 0;
        results.forEach((result) => {
          let points = 0;
          result.answers.forEach((answer, index) => {
            if (answer.correct) {
              points += parseInt(questionPointsDict[questions[index].id], 10);
            }
          });
          playerScores.push({
            player: result.name,
            points,
          });
          totalPoints += points;
        });
        // sort playerScores for top 5
        setPlayerScoresSorted(playerScores.sort((a, b) => b.points - a.points));
        if (!Number.isNaN(totalPoints / playerScores.length)) {
          setAveragePoints(totalPoints / playerScores.length);
        }
      } catch (err) {
        setErrorMsg(err.message);
      }
    };

    calculateTopPlayers();
  }, [results, sessionId, setErrorMsg]);

  useEffect(() => {
    // getting percentages of questions answered correctly

    const QuestionsCorrectCount = [];
    QuestionsCorrectCount.push([
      'Question', 'Proportion of players correct (%)']);
    gameQuestions.forEach((question, index) => {
      let nUsersCorrect = 0;
      results.forEach((result) => {
        if (result.answers[index].correct) {
          nUsersCorrect += 1;
        }
      });
      QuestionsCorrectCount.push([`Question ${index + 1}`, (nUsersCorrect / results.length) * 100]);
    });
    setQuestionAnswersData(QuestionsCorrectCount);
  }, [gameQuestions, results]);

  useEffect(() => {
    // getting average time for each question
    const QuestionTimeAverages = [];
    QuestionTimeAverages.push([
      'Question', 'Average Time Taken(s)']);
    gameQuestions.forEach((question, index) => {
      let totalTimeTaken = 0;
      let nAnswered = 0;
      results.forEach((result) => {
        if (result.answers[index].questionStartedAt !== null) {
          // player has answerd question
          const startTime = result.answers[index].questionStartedAt.split(':');
          const endTime = result.answers[index].answeredAt.split(':');
          const minsTaken = parseInt(endTime[1], 10) - parseInt(startTime[1], 10);
          const secsTaken = parseInt(endTime[2], 10) - parseInt(startTime[2], 10);
          totalTimeTaken += minsTaken * 60 + secsTaken;
          nAnswered += 1;
        }
      });
      QuestionTimeAverages.push([`Question ${index + 1}`, (totalTimeTaken / nAnswered)]);
    });
    setQuestionTimeData(QuestionTimeAverages);
  }, [gameQuestions, results]);

  return (
    <>
      <Typography variant="h5">Game Results</Typography>
      <Box my={1}>
        <Divider />
      </Box>
      { results
        && (
          <>
            <Box my={1}>
              <Typography variant="h6">
                {`Top 5 Players (${results.length} total players`}
                )
              </Typography>
              {playerScoresSorted.map((player, index) => (
                playerScoresSorted.length > 0 && index < 5 && <Typography key={Math.random()} variant="body1">{`${index + 1}. ${player.player}: ${player.points} points`}</Typography>
              ))}
              <Typography>{`Average Points per Player: ${averagePoints}`}</Typography>
            </Box>
            <Box my={1}>
              <Divider variant="middle" />
            </Box>
            <Box my={1}>
              <Typography variant="h6">Proportion of Questions Answered Correctly</Typography>
              {questionAnswersData.length > 1 && (
              <Chart
                data={questionAnswersData}
                chartType="ColumnChart"
                options={{
                  legend: { position: 'none' },
                  hAxis: {
                    title: 'Questions',
                  },
                  vAxis: {
                    title: 'Proportion of players correct (%)',
                    maxValue: 100,
                    minValue: 0,
                  },
                }}
              />
              )}

            </Box>
            <Box my={1}>
              <Divider variant="middle" />
            </Box>
            <Box my={1}>
              <Typography variant="h6">Average Response Time Per Question</Typography>
              {questionTimeData.length > 1 && (
              <Chart
                chartType="LineChart"
                data={questionTimeData}
                options={{
                  legend: { position: 'none' },
                  hAxis: {
                    title: 'Questions',
                  },
                  vAxis: {
                    title: 'Average Time Taken (s)',
                    minValue: 0,
                  },
                }}
              />
              )}
            </Box>
          </>
        )}
    </>
  );
}

export default AdminGameResults;
