import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  FormControl,
  TextField,
  Select,
  MenuItem,
  Divider,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@material-ui/core";


import BackButton from "components/BackButton";

import { useHistory, useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/styles";

import { useSessionContext } from "context/UserSessionContext";
import { useUserContext } from "pages/Users/context";


import toast from "utils/toast";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  divider: theme.divider,
  buttonSave: theme.button.save,
  card: {
    marginTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  sectionLabel: {
    fontWeight: "bold",
    fontSize: 16,
    paddingTop: 20,
    paddingBottom: 10,
    "&:first-child": {
      paddingTop: 5,
      paddingBottom: 20,
    },
  },
  attachLabel: {
    fontWeight: "bold",
    fontSize: 14,
  },
  formControl: {
    paddingTop: 10,
  },
  cardPlan: {
    backgroundColor: "#f8f8f8",
    marginBottom: 16,
  },
  formLabel: {
    fontWeight: "bold",
  },
  growFieldLabel: {
    flexGrow: 1,
    color: "#b6b6b6",
  },
  totalPrice: {
    color: "black",
    fontWeight: "bold",
  },
}));

const checkOptions = (value) => {
  if (value === 0) {
    return false;
  } else if (value === 1) {
    return true;
  }
};

const checkedOptions = (value) => {
  if (value === false) {
    return 0;
  } else if (value === true) {
    return 1;
  }
};

export default function Users() {
  const { isLoading, startLoading, finishLoading } = useSessionContext();
  const {
    userData,
    fetchUserData,
    fulfillSpecificData,
  } = useUserContext();

  const [order, setOrder] = useState(checkOptions(userData.order));
  const [client, setClient] = useState(checkOptions(userData.client));
  const [plan, setPlan] = useState(checkOptions(userData.plan));
  const [support, setSupport] = useState(checkOptions(userData.support));
  const [evaluation, setEvaluation] = useState(checkOptions(userData.evaluation));
  const [impulse, setImpulse] = useState(checkOptions(userData.impulse));
  const [myaccount, setMyaccount] = useState(checkOptions(userData.myaccount));
  const [user, setUser] = useState(checkOptions(userData.user));
  const [occupationArea, setOccupationArea] = useState(checkOptions(userData.occupationArea));
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [status, setStatus] = useState(userData.status)

  const { uidUser } = useParams();
  
  const asyncFetch = async () => {
    startLoading();
    await fetchUserData(uidUser);
    finishLoading();
  };

  useEffect(() => {
    asyncFetch();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateUser = () => {
    const body = {
      name: name,
      email: email,
      status: status,
      order: checkedOptions(order),
      client: checkedOptions(client),
      plan: checkedOptions(plan),
      support: checkedOptions(support),
      evaluation: checkedOptions(evaluation),
      impulse: checkedOptions(impulse),
      myaccount: checkedOptions(myaccount),
      user: checkedOptions(user),
      occupationArea: checkedOptions(occupationArea),
    };

    axios.put(
      `https://api-ieaqui.avamobile.com.br/company/users/${uidUser}`,
      body,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("sessionToken")}`
        }
      }).then(()=>{
        console.log('Atualizado')
        toast.success("Registro salvo com sucesso!");
      }).catch((err)=>{
        console.log(err)
      })
  };
  
  const onSave = async () => {
    startLoading();
    await updateUser();
    finishLoading();
  };

  const styles = useStyles();

  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  if (isLoading) {
    return null;
  }

  // eslint-disable-next-line
  const fulfillData = (dataIndex, { target: { value } }) => {
    if (userData[dataIndex] === value) {
      return null;
    }

    fulfillSpecificData({ dataIndex, value });
  };

  console.log("Order", order);
  console.log("Order2", checkOptions(userData.order));
  console.log("email", email);
  console.log("name", name);
  console.log("status", status);

  return (
    <>
      <Box display="flex">
        <Box>
          <BackButton onClick={goBack} label="Usuário" simpleOnMobile />
        </Box>
        <Box display="flex" justifyContent="flex-end" flexGrow="1">
          <Button
            variant="contained"
            onClick={onSave}
            className={styles.buttonSave}
          >
            Salvar
          </Button>
        </Box>
      </Box>
      <Grid container spacing={2}>
        <Grid item lg={8} md={10} sm={12} xs={12}>
          <Card className={styles.card}>
            <CardContent>
              <Box className={styles.sectionLabel}>Informações</Box>
              <Grid container spacing={2}>
                <Grid item container spacing={2}>
                  <Grid item lg={12} xs={12}>
                    <FormControl className={styles.formControl} fullWidth>
                      <TextField
                        label="Nome"
                        variant="outlined"
                        size="small"
                        //defaultValue={name}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item container spacing={2}>
                  <Grid item lg={12} xs={12}>
                    <FormControl className={styles.formControl} fullWidth>
                      <TextField
                        label="E-mail"
                        variant="outlined"
                        size="small"
                        //defaultValue={userData?.email}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item container spacing={2} direction="column">
                  <CardHeader title="Opções de acesso" />
                  <Divider />
                  <Grid>
                    <Box display="flex">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              defaultChecked={order}
                              value={order}
                              onChange={() => setOrder(!order)}
                            />
                          }
                          label="Solicitações"
                        />
                      </FormGroup>
                    </Box>
                    <Divider />
                    <Box display="flex">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              defaultChecked={client}
                              value={client}
                              onChange={() => setClient(!client)}
                            />
                          }
                          label="Clientes"
                        />
                      </FormGroup>
                    </Box>
                    <Divider />
                    <Box display="flex">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              defaultChecked={plan}
                              value={plan}
                              onChange={() => setPlan(!plan)}
                            />
                          }
                          label="Planos"
                        />
                      </FormGroup>
                    </Box>
                    <Divider />
                    <Box display="flex">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              defaultChecked={support}
                              value={support}
                              onChange={() => setSupport(!support)}
                            />
                          }
                          label="Suporte"
                        />
                      </FormGroup>
                    </Box>
                    <Divider />
                    <Box display="flex">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              defaultChecked={evaluation}
                              value={evaluation}
                              onChange={() => setEvaluation(!evaluation)}
                            />
                          }
                          label="Avaliações"
                        />
                      </FormGroup>
                    </Box>
                    <Divider />
                    <Box display="flex">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              defaultChecked={impulse}
                              value={impulse}
                              onChange={() => setImpulse(!impulse)}
                            />
                          }
                          label="Impulsionar"
                        />
                      </FormGroup>
                    </Box>
                    <Divider />
                    <Box display="flex">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              defaultChecked={myaccount}
                              value={myaccount}
                              onChange={() => setMyaccount(!myaccount)}
                            />
                          }
                          label="Minha Conta"
                        />
                      </FormGroup>
                    </Box>
                    <Divider />
                    <Box display="flex">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              defaultChecked={user}
                              value={user}
                              onChange={() => setUser(!user)}
                            />
                          }
                          label="Usuários"
                        />
                      </FormGroup>
                    </Box>
                    <Divider />
                    <Box display="flex">
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              defaultChecked={occupationArea}
                              value={occupationArea}
                              onChange={() => setOccupationArea(!occupationArea)}
                            />
                          }
                          label="Área de atuação"
                        />
                      </FormGroup>
                    </Box>
                    <Divider />
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item lg={4} md={12} sm={12} xs={12}>
          <Card className={styles.card}>
            <CardHeader title="Status" />
            <CardContent>
              <Box display="flex" flexGrow="1">
                O usuário se encontra:
              </Box>
              <Select
                value={status}
                onChange={(e)=>setStatus(e.target.value)}
                fullWidth
              >
                <MenuItem value={"ativo"}>
                  <Typography fullWidth>ATIVO</Typography>
                </MenuItem>
                <MenuItem value={"inativo"}>INATIVO</MenuItem>
              </Select>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
