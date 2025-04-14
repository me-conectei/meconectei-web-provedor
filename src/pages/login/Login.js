import React, { useCallback, useState, useEffect } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  TextField,
  Fade,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// logo
import google from "../../images/google.svg";
import logo from "../../images/logo.svg";

// context
import { useUserDispatch, loginUser } from "../../context/UserContext";
import toastTypes from "utils/toast";
import firebase from '../../firebase/index';

function Login(props) {
  const classes = useStyles();

  // global
  let userDispatch = useUserDispatch();

  // local
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTabId] = useState(0);
  const [nameValue, setNameValue] = useState("");
  const [loginValue, setLoginValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedCredentials = localStorage.getItem('savedCredentials');
    if (savedCredentials) {
      const { email, password, remember } = JSON.parse(savedCredentials);
      setLoginValue(email || '');
      setPasswordValue(password || '');
      setRememberMe(remember || false);
    }
  }, []);

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const saveCredentials = () => {
    if (rememberMe) {
      localStorage.setItem('savedCredentials', JSON.stringify({
        email: loginValue,
        password: passwordValue,
        remember: true
      }));
    } else {
      localStorage.removeItem('savedCredentials');
    }
  };

  const handleLogin = () => {
    saveCredentials();
    loginUser(
      userDispatch,
      loginValue,
      passwordValue,
      props.history,
      setIsLoading,
      setError
    );
  };

  const forgotPassword = useCallback(() => {
    if (!loginValue || loginValue === "") {
      toastTypes.info('Email nao preenchido')
      return
    }

    setIsLoading(true)
    firebase.auth().sendPasswordResetEmail(loginValue)
      .then(() => {
        toastTypes.info(`Enviado email de recuperacao para ${loginValue}`)
        setIsLoading(false)
      })
  }, [loginValue])

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img alt="logo" src={logo} style={{ width: '50%' }} />
      </div>
      <div className={classes.formContainer}>
        <div className={classes.form}>
          {activeTabId === 0 && (
            <React.Fragment>
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  E-mail ou senha incorretos
                </Typography>
              </Fade>
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
                margin="normal"
                placeholder="Email Adress"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    color="primary"
                  />
                }
                label="Lembrar conta"
                className={classes.rememberMeCheckbox}
              />
              <div className={classes.formButtons}>
                {isLoading ? (
                  <CircularProgress size={26} className={classes.loginLoader} />
                ) : (
                  <Button
                    disabled={
                      loginValue.length === 0 || passwordValue.length === 0
                    }
                    onClick={handleLogin}
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    Entrar
                  </Button>
                )}
                <Button
                  color="primary"
                  size="large"
                  className={classes.forgetButton}
                  onClick={forgotPassword}
                >
                  Esqueci a senha
                </Button>
              </div>
            </React.Fragment>
          )}
          {activeTabId === 1 && (
            <React.Fragment>
              <Typography variant="h1" className={classes.greeting}>
                Welcome!
              </Typography>
              <Typography variant="h2" className={classes.subGreeting}>
                Create your account
              </Typography>
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  Something is wrong with your login or password :(
                </Typography>
              </Fade>
              <TextField
                id="name"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                margin="normal"
                placeholder="Full Name"
                type="text"
                fullWidth
              />
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
                margin="normal"
                placeholder="Email Adress"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              />
              <div className={classes.creatingButtonContainer}>
                {isLoading ? (
                  <CircularProgress size={26} />
                ) : (
                  <Button
                    onClick={handleLogin}
                    disabled={
                      loginValue.length === 0 ||
                      passwordValue.length === 0 ||
                      nameValue.length === 0
                    }
                    size="large"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={classes.createAccountButton}
                  >
                    Create your account
                  </Button>
                )}
              </div>
              <div className={classes.formDividerContainer}>
                <div className={classes.formDivider} />
                <Typography className={classes.formDividerWord}>or</Typography>
                <div className={classes.formDivider} />
              </div>
              <Button
                size="large"
                className={classnames(
                  classes.googleButton,
                  classes.googleButtonCreating
                )}
              >
                <img src={google} alt="google" className={classes.googleIcon} />
                &nbsp;Sign in with Google
              </Button>
            </React.Fragment>
          )}
        </div>
      </div>
    </Grid>
  );
}

export default withRouter(Login);
