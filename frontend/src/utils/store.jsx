import React from 'react';
import PropTypes from 'prop-types';

export const StoreContext = React.createContext(null);

export default function StoreProvider({ children }) {
  const [errorMsg, setErrorMsg] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');

  const store = {
    errorMsgContext: [errorMsg, setErrorMsg],
    successMsgContext: [successMsg, setSuccessMsg],
  };

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

StoreProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
