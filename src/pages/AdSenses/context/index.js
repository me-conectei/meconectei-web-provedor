import { useReducer } from "react";

import contextReducer, { initialState } from "./reducer";
import contextActions from "./actions";

export default function DashboardContext() {
    const [store, dispatch] = useReducer(contextReducer, initialState);
    const actions = contextActions(dispatch);

    return {
        ...store,
        ...actions,
    }
}