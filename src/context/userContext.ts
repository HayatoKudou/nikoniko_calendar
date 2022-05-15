import * as React from "react";

interface UserContext {
  user: User | null;
  setUser: (next: User) => void;
}

const UserContext = React.createContext<UserContext>({
  user: null,
  setUser: () => {},
});

export default UserContext;
