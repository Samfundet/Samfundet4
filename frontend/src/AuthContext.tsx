import { createContext, useContext, useEffect, useState } from 'react';
import { getUser } from '~/api';
import { UserDto } from '~/dto';
import { Children, SetState } from '~/types';

type AuthContextProps = {
  user: UserDto | undefined;
  setUser: SetState<UserDto | undefined>;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuthContext() {
  const authContext = useContext(AuthContext);

  if (authContext === undefined) {
    throw new Error('useAuthContext must be used within an AuthContextProvider');
  }

  return authContext;
}

type AuthContextProviderProps = {
  children: Children;
};

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDto>();

  // Stuff to do on first render.
  useEffect(() => {
    // Always attempt to load user on first render.
    getUser()
      .then((user) => setUser(user))
      .catch(console.error);
  }, []);

  const contextValue: AuthContextProps = {
    user: user,
    setUser: setUser,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
