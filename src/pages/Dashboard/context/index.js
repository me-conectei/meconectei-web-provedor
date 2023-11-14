import { useReducer, createContext, useContext } from "react";
import dashboardReducer, { initialState } from "./reducer";
import dashboardActions from "./actions";

const Context = createContext({});


export default function DashboardContext({ children }) {
    const [store, dispatch] = useReducer(dashboardReducer, initialState);
    const actions = dashboardActions(dispatch);

    return (
        <Context.Provider value={{ ...store, ...actions }}>
            {children}
        </Context.Provider>
    );
}

export const useDashboardContext = () => useContext(Context);