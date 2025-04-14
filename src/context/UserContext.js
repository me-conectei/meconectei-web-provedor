import React from "react";
import firebase from "../firebase";
import { createCommandService, APIMethods } from "services";
var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("id_token"),
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

function loginUser(dispatch, login, password, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);

  if (!!login && !!password) {
    firebase
      .auth()
      .signInWithEmailAndPassword(login, password)
      .then((user) => {
        localStorage.setItem('id_token', user.user.uid)
        setError(null)
        createCommandService({
          url: "/registerSession",
          method: APIMethods.POST,
          payload: {
            uidUser: user.user.uid,
          },
          onCustomError: e => {
            setIsLoading(false);
            debugger;
          },
          onSuccess: ({ data }) => {
            if (data?.success) {
              localStorage.setItem('sessionToken', data.JWT);
              dispatch({ type: 'LOGIN_SUCCESS' })
              history.push('/app/indicadores')
            } else {
              console.error(data.errorMessage);
            }
            setIsLoading(false);
          }
        });
      })
      .catch((err) => {
        setError(true);
        setIsLoading(false);
      });
  } else {
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
}

function signOut(dispatch, history) {
  localStorage.clear();
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}
