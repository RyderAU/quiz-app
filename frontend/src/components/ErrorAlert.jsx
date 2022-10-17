import React, { useState, useEffect, useContext } from 'react';
import { Alert, AlertTitle } from '@material-ui/lab';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { StoreContext } from '../utils/store';

function ErrorAlert() {
  const [open, setOpen] = useState(true);
  const { errorMsgContext } = useContext(StoreContext);
  const [errorMsg, setErrorMsg] = errorMsgContext;

  useEffect(() => {
    setOpen(true);
  }, [errorMsg]);

  return (
    <>
      {errorMsg !== '' && (
        <Collapse in={open}>
          <Alert
            severity="error"
            action={(
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setErrorMsg('');
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            )}
          >
            <AlertTitle>Error</AlertTitle>
            {errorMsg}
          </Alert>
        </Collapse>
      )}
    </>
  );
}

export default ErrorAlert;
