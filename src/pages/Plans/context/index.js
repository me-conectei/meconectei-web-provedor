import { useReducer, createContext, useContext } from "react";

import contextReducer, { initialState } from "./reducer";
import contextActions from "./actions";

const Context = createContext({});

export default function PlanContext({ children }) {
    const [store, dispatch] = useReducer(contextReducer, initialState);
    const actions = contextActions(dispatch);

    return (
        <Context.Provider value={{ ...store, ...actions }}>
            {children}
        </Context.Provider>
    );
}

export const usePlanContext = () => useContext(Context);