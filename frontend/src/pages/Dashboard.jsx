import React, { useState, useContext, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { authAPIget, fileToDataUrl } from '../utils/Helper';
import { StoreContext } from '../utils/store';

import GameCard from '../components/GameCard';
import AddGameDialog from '../components/AddGameDialog';
import UploadGameDialog from '../components/UploadGameDialog';

function Dashboard() {
  const { errorMsgContext } = useContext(StoreContext);
  const [, setErrorMsg] = errorMsgContext;
  const { successMsgContext } = useContext(StoreContext);
  const [, setSuccessMsg] = successMsgContext;
  // list of gameids for rendering
  const [gameIDs, setGameIDs] = useState([]);

  const [addGameDialogOpen, setAddGameDialogOpen] = useState(false);
  const [uploadGameDialogOpen, setUploadGameDialogOpen] = useState(false);

  useEffect(() => {
    const initialGetGames = async () => {
      try {
        const gamesList = await authAPIget('admin/quiz', null, 'GET');
        setErrorMsg('');
        setGameIDs([]);
        gamesList.quizzes.forEach((game) => {
          // create list of all games in backend i.e. the initial games
          setGameIDs((prevState) => [...prevState, game.id]);
        });
      } catch (err) {
        setErrorMsg(err.message);
      }
    };
    initialGetGames();
  }, [setErrorMsg]);

  const createEmptyGame = async (gameName, gameThumbnail) => {
    try {
      if (gameThumbnail !== undefined) {
        // create gamee with thumbnail
        fileToDataUrl(gameThumbnail).then(async (thumbnail) => {
          let body = {
            name: gameName,
          };
          const gameID = await authAPIget('admin/quiz/new', body, 'POST');
          setErrorMsg('');
          body = {
            thumbnail,
          };
          await authAPIget(`admin/quiz/${gameID.quizId}`, body, 'PUT');

          setGameIDs([...gameIDs, gameID.quizId]);
          setSuccessMsg(`Game (${gameName}) successfully created with thumbnail`);
        });
      } else {
        const body = {
          name: gameName,
        };
        const gameID = await authAPIget('admin/quiz/new', body, 'POST');
        setGameIDs([...gameIDs, gameID.quizId]);
        setSuccessMsg(`Game (${gameName}) successfully created`);
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <>
      <Grid container justify="space-between" alignItems="flex-end">
        <Grid item>
          <Typography variant="h5" aria-label="dashboard title">Dashboard</Typography>
        </Grid>
        <Grid item>
          <Grid container spacing={1}>
            <Grid item>
              <Button
                variant="contained"
                type="submit"
                aria-label="upload game"
                color="primary"
                onClick={() => {
                  setUploadGameDialogOpen(true);
                }}
              >
                Upload Game
              </Button>
            </Grid>
            <Grid item>
              <Button
                id="create-game-button"
                variant="contained"
                type="submit"
                aria-label="create game"
                color="primary"
                onClick={() => {
                  setAddGameDialogOpen(true);
                }}
              >
                Create Game
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box my={1}>
        <Divider />
      </Box>
      <AddGameDialog
        open={addGameDialogOpen}
        setOpen={setAddGameDialogOpen}
        onFormSubmit={createEmptyGame}
      />
      <UploadGameDialog
        open={uploadGameDialogOpen}
        setOpen={setUploadGameDialogOpen}
        gameIDs={gameIDs}
        setGameIDs={setGameIDs}
      />
      <Grid container justify="center" spacing={2}>
        {gameIDs.map((gameid) => (
          <Grid key={gameid} item>
            <GameCard gameid={gameid} gameIDs={gameIDs} setGameIDs={setGameIDs} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default Dashboard;
