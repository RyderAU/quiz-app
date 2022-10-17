import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EditGame from './pages/EditGame';
import JoinGame from './pages/JoinGame';
import PlayGame from './pages/PlayGame';
import PlayerGameResults from './pages/PlayerGameResults';
import AdminGameResults from './pages/AdminGameResults';
import GameStatus from './pages/GameStatus';
import ErrorAlert from './components/ErrorAlert';
import SuccessAlert from './components/SuccessAlert';
import Header from './components/Header';
import StoreProvider from './utils/store';
import EditQuestion from './pages/EditQuestion';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <StoreProvider>
      <div className="app">
        <BrowserRouter>
          <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
          <ErrorAlert />
          <SuccessAlert />

          <Box m={3.5}>
            <Switch>
              <Route exact path="/">
                <Login setLoggedIn={setLoggedIn} />
              </Route>
              <Route path="/register">
                <Register setLoggedIn={setLoggedIn} />
              </Route>
              <Route path="/dashboard">
                {loggedIn ? <Dashboard /> : <Login setLoggedIn={setLoggedIn} />}
              </Route>
              <Route path="/edit-game">
                {loggedIn ? <EditGame /> : <Login setLoggedIn={setLoggedIn} />}
              </Route>
              <Route path="/edit-question">
                {loggedIn ? <EditQuestion /> : <Login setLoggedIn={setLoggedIn} />}
              </Route>
              <Route path="/game-status">
                {loggedIn ? <GameStatus /> : <Login setLoggedIn={setLoggedIn} />}
              </Route>
              <Route path="/admin-game-results">
                {loggedIn ? <AdminGameResults /> : <Login setLoggedIn={setLoggedIn} />}
              </Route>
              <Route path="/join-game">
                <JoinGame />
              </Route>
              <Route path="/player-game-results">
                <PlayerGameResults />
              </Route>
              <Route path="/play-game">
                <PlayGame />
              </Route>
              <Route path="/">
                <div>Page Not Found</div>
              </Route>
            </Switch>
          </Box>
        </BrowserRouter>
      </div>
    </StoreProvider>
  );
}

export default App;
