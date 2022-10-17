import React, { useState, useContext, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { useHistory } from 'react-router-dom';
import { unauthAPIget } from '../utils/Helper';
import { StoreContext } from '../utils/store';

function PlayerGameResults() {
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const playerId = params.get('playerId');

  const { errorMsgContext } = useContext(StoreContext);
  const [, setErrorMsg] = errorMsgContext;

  const [results, setResults] = useState([]);

  useEffect(() => {
    const getResults = async () => {
      try {
        const r = await unauthAPIget(`play/${playerId}/results`, null, 'GET');
        setResults(r);
      } catch (err) {
        setErrorMsg(err.message);
      }
    };
    getResults();
  }, [playerId, setErrorMsg]);

  return (
    <>

      <Typography variant="h5">Game Results</Typography>
      <Box my={1}>
        <Divider />
      </Box>
      {results.length > 0
      && (
      <div>
        {results.map((result, index) => (
          result.correct ? (
            <Typography key={Math.random()} variant="body1">
              {`Question ${index + 1}: correct`}
            </Typography>
          ) : (
            <Typography key={Math.random()} variant="body1">
              {`Question ${index + 1}: incorrect`}
            </Typography>
          )
        ))}
      </div>
      )}
    </>
  );
}

export default PlayerGameResults;
