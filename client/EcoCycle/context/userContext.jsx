import PropTypes from 'prop-types';
import axios from "axios";
import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext({})

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  // const [error, setError] = useState(null);
  useEffect(() => {
    if (!user) {
      axios.get('/profile').then(({ data }) => {
        setUser(data)
      }).catch((error) => {
        console.log(error);
      });
    }
  
 
  }, [ user])
  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  )
}

UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  };
