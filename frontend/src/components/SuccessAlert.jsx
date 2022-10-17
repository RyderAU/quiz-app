import React, { useContext, useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { Alert } from '@material-ui/lab';

import { StoreContext } from '../utils/store';

function SuccessAlert() {
  const [open, setOpen] = useState(false);
  const { successMsgContext } = useContext(StoreContext);
  const [successMsg, setSuccessMsg] = successMsgContext;

  useEffect(() => {
    if (successMsg !== '') {
      setOpen(true);
    }
  }, [successMsg]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setSuccessMsg('');
  };

  return (
    <>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          {successMsg}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SuccessAlert;
