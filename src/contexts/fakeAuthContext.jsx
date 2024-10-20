import { useContext, useReducer } from 'react';
import { createContext } from 'react';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'log_in':
      return { ...state, user: action.payload, isAuthenticated: true };

    case 'log_out':
      return { initialState };

    default:
      throw new Error('unknown action');
  }
}

const FAKE_USER = {
  name: 'Damilare',
  email: 'damilare@example.com',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz',
};

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // logIn
  const logIn = (email, password) => {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: 'log_in', payload: FAKE_USER });
  };

  // logOut
  const logOut = () => {
    dispatch({ type: 'log_out' });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error('AuthContext was used outside of the AuthProvider scope');
  return context;
}

export { AuthProvider, useAuth };
