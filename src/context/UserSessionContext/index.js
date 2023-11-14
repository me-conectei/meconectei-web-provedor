import { useReducer, createContext, useContext } from "react";

import sessionReducer, { initialState } from "./reducer";
import sessionActions from "./actions";

const Context = createContext({});

export default function UserSessionContext({ children }) {
    const [store, dispatch] = useReducer(sessionReducer, initialState);
    const actions = sessionActions(dispatch);

    return (
        <Context.Provider value={{ ...store, ...actions }}>
            {children}
        </Context.Provider>
    );
}

export const useSessionContext = () => useContext(Context);