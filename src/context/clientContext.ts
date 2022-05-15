import * as React from "react";

interface ClientContext {
  client: Client | null;
  setClient: (next: Client) => void;
}

const ClientContext = React.createContext<ClientContext>({
  client: null,
  setClient: () => {},
});

export default ClientContext;
