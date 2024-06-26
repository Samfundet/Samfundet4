import { createContext, useContext, useEffect, useState } from 'react';
import { getUser } from '~/api';
import { UserDto } from '~/dto';
import { Children, SetState } from '~/types';

type AuthContextProps = {
  user: UserDto | undefined;
  setUser: SetState<UserDto | undefined>;
  loading: boolean;
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
  enabled?: boolean; // Enable/disable all side-effects, useful when used in Storybook.
  children: Children;
};

export function AuthContextProvider({ children, enabled = true }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDto>();
  const [loading, setLoading] = useState(true);

  // Stuff to do on first render.
  useEffect(() => {
    if (!enabled) return;

    setLoading(true);

    // Always attempt to load user on first render.
    getUser()
      .then((user) => setUser(user))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [enabled]);

  const contextValue: AuthContextProps = {
    user,
    setUser,
    loading,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
