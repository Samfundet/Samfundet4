import { createContext, useContext, useState } from 'react';
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
  const [user, setUser] = useState<UserDto | undefined>(undefined);

  const contextValue: AuthContextProps = {
    user: user,
    setUser: setUser,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
