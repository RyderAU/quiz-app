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
import { Typography } from '@material-ui/core';

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
          <DialogTitle>Edit Game Details</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1">If left blank, that attribute will remain the same</Typography>

            <Grid container spacing={2} direction="column">
              <Grid item>
                <TextField
                  id="game-name"
                  label="Replace game name"
                  variant="filled"
                  fullWidth
                  onChange={(e) => setGameName(e.target.value)}
                />
              </Grid>
              <Grid item>
                <FormLabel component="legend">Replace Thumbnail</FormLabel>
                <DropzoneArea
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
            <Button onClick={handleClose} color="primary" aria-label="cancel">
              Cancel
            </Button>
            <Button type="submit" onSubmit={onSubmit} color="primary" aria-label="add">
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
