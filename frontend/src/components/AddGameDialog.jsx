import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormLabel from '@material-ui/core/FormLabel';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { DropzoneArea } from 'material-ui-dropzone';

function AddGameDialog({
  open, setOpen, onFormSubmit,
}) {
  const [gameName, setGameName] = useState('');
  const [gameThumbnail, setGameThumbnail] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(gameName, gameThumbnail);
    handleClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={onSubmit}>
          <DialogTitle>Add A New Game</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <TextField
                  required
                  id="game-name"
                  label="Name"
                  aria-label="game name"
                  variant="filled"
                  fullWidth
                  onChange={(e) => setGameName(e.target.value)}
                />
              </Grid>
              <Grid item>
                <FormLabel component="legend">Upload a thumbnail (optional)</FormLabel>
                <DropzoneArea
                  id="thumbnail-upload"
                  aria-label="new game thumbnail upload"
                  acceptedFiles={['image/jpeg', 'image/png', 'image/jpg']}
                  onChange={(files) => {
                    setGameThumbnail(files[0]);
                  }}
                  dropzoneText="Drag and drop an image here or click"
                  filesLimit={1}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" aria-label="cancel adding new game">
              Cancel
            </Button>
            <Button id="add-game-button" type="submit" onSubmit={onSubmit} color="primary" aria-label="add the new game">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

AddGameDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
};

export default AddGameDialog;
